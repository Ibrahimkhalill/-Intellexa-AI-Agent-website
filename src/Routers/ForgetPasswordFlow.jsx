import { useState } from "react";
import ForgetEmail from "../Pages/Authentication/ForgetEmail";
import ForgetOtpVerification from "../Pages/Authentication/ForgetOtpVerification";
import ResetPassword from "../Pages/Authentication/ResetPassword";

export default function ForgetPasswordFlow() {
  const [step, setStep] = useState(1);
  const [user_id, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [secret_key, setSecretKey] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div>
      {step === 1 && (
        <ForgetEmail
          defaultEmail={email}
          onSuccess={(user_id, email) => {
            setUserId(user_id);
            setEmail(email);
            nextStep();
          }}
        />
      )}
      {step === 2 && (
        <ForgetOtpVerification
          user_id={user_id}
          email={email}
          onSuccess={(user_id, secret_key) => {
            setSecretKey(secret_key);
            setUserId(user_id);
            nextStep();
          }}
          onBack={prevStep}
        />
      )}
      {step === 3 && (
        <ResetPassword
          secret_key={secret_key}
          user_id={user_id}
          onBack={prevStep}
        />
      )}
    </div>
  );
}
