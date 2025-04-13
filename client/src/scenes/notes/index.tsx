import { Outlet } from "react-router-dom";

export default function Notes() {
  return (
    <div className="relative min-h-screen">
      <main className="flex items-center justify-center">
      <Outlet /> {/* Child (Notes) pages */}
      </main>

    </div>
  );
}
