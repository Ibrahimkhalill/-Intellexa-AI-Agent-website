import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import axiosInstance, { AUTH_USER_KEY } from "../../components/axiosinstance";
import { renderWithProviders } from "../../test/renderWithProviders";
import SignIn from "./SignIn";

const fillAndSubmit = async (password = "Secret#123") => {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText("Enter your email"), "a@test.com");
  await user.type(screen.getByPlaceholderText("Enter your password"), password);
  await user.click(screen.getByRole("button", { name: "Login" }));
};

describe("SignIn", () => {
  afterEach(() => vi.restoreAllMocks());

  it("logs in and stores only non-sensitive user info", async () => {
    vi.spyOn(axiosInstance, "post").mockResolvedValue({
      data: {
        access_token: "secret-token",
        email_address: "a@test.com",
        profile: { first_name: "Ann" },
      },
    });
    renderWithProviders(<SignIn />, { route: "/signin", path: "/signin" });

    await fillAndSubmit();

    expect(await screen.findByTestId("location")).toHaveTextContent("/");
    const stored = localStorage.getItem(AUTH_USER_KEY);
    expect(JSON.parse(stored)).toEqual({ email: "a@test.com", username: "Ann" });
    expect(stored).not.toContain("secret-token");
  });

  it("sends unverified users to the OTP page", async () => {
    vi.spyOn(axiosInstance, "post").mockRejectedValue({
      response: { status: 403, data: { user_id: 7, message: "Please verify your email." } },
    });
    renderWithProviders(<SignIn />, { route: "/signin", path: "/signin" });

    await fillAndSubmit();

    expect(await screen.findByTestId("location")).toHaveTextContent("/otp");
  });

  it("shows the backend error for wrong credentials", async () => {
    vi.spyOn(axiosInstance, "post").mockRejectedValue({
      response: { status: 401, data: { message: "Invalid email or password" } },
    });
    renderWithProviders(<SignIn />, { route: "/signin", path: "/signin" });

    await fillAndSubmit("Wrong#123");

    expect(await screen.findByText("Invalid email or password")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/signin");
  });
});
