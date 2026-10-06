import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import OtpInputs from "./OtpInputs";
import { otpFromForm } from "../utils/validation";

const Harness = ({ onSubmit, onPasteComplete = () => {}, setApiError = () => {} }) => {
  const { register, handleSubmit, setValue, trigger } = useForm();
  return (
    <form onSubmit={handleSubmit((data) => onSubmit(otpFromForm(data)))}>
      <OtpInputs
        register={register}
        setValue={setValue}
        trigger={trigger}
        setApiError={setApiError}
        onPasteComplete={() => onPasteComplete(handleSubmit((data) => onSubmit(otpFromForm(data))))}
      />
      <button type="submit">Verify</button>
    </form>
  );
};

describe("OtpInputs", () => {
  it("submits digits typed one by one and moves focus forward", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    const boxes = screen.getAllByRole("textbox");
    await user.click(boxes[0]);
    await user.keyboard("123456");
    expect(boxes[5]).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Verify" }));
    expect(onSubmit).toHaveBeenCalledWith("123456");
  });

  it("ignores non-digits", async () => {
    const user = userEvent.setup();
    render(<Harness onSubmit={vi.fn()} />);
    const boxes = screen.getAllByRole("textbox");
    await user.type(boxes[0], "a");
    expect(boxes[0]).toHaveValue("");
  });

  it("fills every box from a pasted code and submits", async () => {
    const onSubmit = vi.fn();
    const onPasteComplete = vi.fn((submit) => submit());
    render(<Harness onSubmit={onSubmit} onPasteComplete={onPasteComplete} />);

    const boxes = screen.getAllByRole("textbox");
    fireEvent.paste(boxes[2], { clipboardData: { getData: () => "65-43-21" } });

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith("654321"));
    expect(boxes.map((box) => box.value).join("")).toBe("654321");
  });

  it("reports pasted codes that are not 6 digits", () => {
    const setApiError = vi.fn();
    render(<Harness onSubmit={vi.fn()} setApiError={setApiError} />);
    fireEvent.paste(screen.getAllByRole("textbox")[0], { clipboardData: { getData: () => "123" } });
    expect(setApiError).toHaveBeenCalledWith("Pasted OTP must be 6 digits");
  });
});
