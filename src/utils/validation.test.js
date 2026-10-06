import { describe, expect, it } from "vitest";
import { getApiErrorMessage, otpFromForm, passwordRules } from "./validation";

describe("passwordRules", () => {
  const isValid = (password) => passwordRules.pattern.value.test(password);

  it("accepts any special character, not just @$!%*?&", () => {
    expect(isValid("Secret#123")).toBe(true);
    expect(isValid("Secret_123")).toBe(true);
    expect(isValid("Secret@123")).toBe(true);
  });

  it("rejects passwords missing a required character type or too short", () => {
    expect(isValid("secret#123")).toBe(false); // no uppercase
    expect(isValid("SECRET#123")).toBe(false); // no lowercase
    expect(isValid("Secret#abc")).toBe(false); // no digit
    expect(isValid("Secret1234")).toBe(false); // no special
    expect(isValid("Se#1")).toBe(false); // too short
  });
});

describe("otpFromForm", () => {
  it("joins the six boxes in order", () => {
    expect(otpFromForm({ otp2: "3", otp0: "1", otp1: "2", otp3: "4", otp4: "5", otp5: "6" })).toBe("123456");
  });
});

describe("getApiErrorMessage", () => {
  it("prefers the backend message, then error, then the fallback", () => {
    expect(getApiErrorMessage({ response: { data: { message: "Bad OTP" } } }, "x")).toBe("Bad OTP");
    expect(getApiErrorMessage({ response: { data: { error: "Down" } } }, "x")).toBe("Down");
    expect(getApiErrorMessage({ response: { data: {} } }, "fallback")).toBe("fallback");
  });

  it("reports network errors when there is no response", () => {
    expect(getApiErrorMessage(new Error("offline"), "x")).toMatch(/network error/i);
  });
});
