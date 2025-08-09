// src/pages/CancelPage.jsx
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <XCircle className="text-red-600 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-red-800 mb-2">
        Payment Cancelled
      </h1>
      <p className="text-red-700 text-lg">
        Your payment was not completed. You can try again if you&#39;d like.
      </p>
    </div>
  );
}
