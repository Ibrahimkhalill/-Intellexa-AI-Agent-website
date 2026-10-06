// Six single-digit OTP boxes wired to react-hook-form (fields otp0..otp5).
// Typing moves focus forward, Backspace moves back, and a pasted 6-digit code
// fills every box and submits.
const OTP_LENGTH = 6;

const OtpInputs = ({ register, setValue, trigger, onPasteComplete, setApiError }) => {
  const focusInput = (index) => {
    document.querySelector(`input[name="otp${index}"]`)?.focus();
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length !== OTP_LENGTH) {
      setApiError("Pasted OTP must be 6 digits");
      return;
    }
    pastedData.split("").forEach((char, index) => {
      setValue(`otp${index}`, char, { shouldValidate: true });
    });
    focusInput(OTP_LENGTH - 1);
    if (await trigger()) {
      onPasteComplete();
    }
  };

  return (
    <div className="flex sm:space-x-4 space-x-2 justify-center">
      {Array.from({ length: OTP_LENGTH }, (_, index) => {
        const field = register(`otp${index}`, {
          required: "This field is required",
          pattern: {
            value: /^[0-9]$/,
            message: "Must be a digit",
          },
        });
        return (
          <input
            key={index}
            {...field}
            // Strip non-digits, update react-hook-form, then move to the next box
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(-1);
              field.onChange(e);
              if (e.target.value && index < OTP_LENGTH - 1) focusInput(index + 1);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && e.target.value === "" && index > 0) {
                focusInput(index - 1);
              }
            }}
            onPaste={handlePaste}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength="1"
            className="w-12 h-12 text-center border border-base-300 bg-base-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ACACAC] text-lg"
          />
        );
      })}
    </div>
  );
};

export default OtpInputs;
