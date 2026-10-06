import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axiosInstance, { AUTH_LOGOUT_EVENT, AUTH_USER_KEY } from "./axiosinstance";

// Fake transport: respond with the queued results in order
const queueResponses = (...results) => {
  const calls = [];
  axiosInstance.defaults.adapter = (config) => {
    calls.push(config);
    const result = results.shift();
    if (result.status >= 400) {
      const error = new Error(`Request failed with status ${result.status}`);
      error.config = config;
      error.response = { status: result.status, data: result.data || {}, config };
      return Promise.reject(error);
    }
    return Promise.resolve({ status: result.status, data: result.data, headers: {}, config });
  };
  return calls;
};

describe("axiosInstance", () => {
  const originalAdapter = axiosInstance.defaults.adapter;

  beforeEach(() => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email: "a@test.com" }));
  });

  afterEach(() => {
    axiosInstance.defaults.adapter = originalAdapter;
    vi.restoreAllMocks();
  });

  it("sends cookies and the CSRF header", async () => {
    const calls = queueResponses({ status: 200, data: [] });
    await axiosInstance.get("api/booking/list/");
    expect(calls[0].withCredentials).toBe(true);
    expect(calls[0].headers["X-Requested-With"]).toBe("XMLHttpRequest");
  });

  it("refreshes the session once on 401 and retries the request", async () => {
    const refresh = vi.spyOn(axios, "post").mockResolvedValue({ data: {} });
    const calls = queueResponses({ status: 401 }, { status: 200, data: ["ok"] });

    const response = await axiosInstance.get("api/booking/list/");

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(refresh.mock.calls[0][0]).toMatch(/api\/auth\/refresh\/$/);
    expect(calls).toHaveLength(2);
    expect(response.data).toEqual(["ok"]);
  });

  it("logs out when the refresh fails", async () => {
    vi.spyOn(axios, "post").mockRejectedValue(new Error("expired"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const onLogout = vi.fn();
    window.addEventListener(AUTH_LOGOUT_EVENT, onLogout);
    queueResponses({ status: 401 });

    await expect(axiosInstance.get("api/auth/profile/")).rejects.toThrow();
    expect(onLogout).toHaveBeenCalledTimes(1);
    window.removeEventListener(AUTH_LOGOUT_EVENT, onLogout);
  });

  it("does not try to refresh for a failed sign in", async () => {
    const refresh = vi.spyOn(axios, "post");
    queueResponses({ status: 401, data: { message: "Invalid email or password" } });

    await expect(axiosInstance.post("api/auth/sign-in/", {})).rejects.toThrow();
    expect(refresh).not.toHaveBeenCalled();
  });
});
