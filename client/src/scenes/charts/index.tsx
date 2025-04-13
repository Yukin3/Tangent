import { Outlet } from "react-router-dom";

export default function Charts() {
  return (
    <div className="relative min-h-screen">
      <main className="flex items-center justify-center">
      <Outlet /> {/* Child (Charts) pages */}
      </main>

    </div>
  );
}
