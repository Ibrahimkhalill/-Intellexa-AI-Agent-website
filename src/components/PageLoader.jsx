// Shown while a lazily-loaded page is downloading
export default function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin" />
    </div>
  );
}
