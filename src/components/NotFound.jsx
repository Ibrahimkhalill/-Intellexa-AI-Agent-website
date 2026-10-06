import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-black text-white rounded-md hover:bg-slate-600 transition">
        Go Home
      </Link>
    </div>
  );
}
