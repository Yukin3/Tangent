import { Outlet } from "react-router-dom";

export default function Networks() {
  return (
    <div className="relative min-h-screen">
      <main className="flex items-center justify-center">
      <Outlet /> {/* Child (Networks) pages */}
      </main>

    </div>
  );
}
