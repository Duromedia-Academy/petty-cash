"use client";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { useMobileSidebarToggle } from "@/components/context/mobileSidebarContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useMobileSidebarToggle();

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <div className="flex">
        <aside
          className={` "w-64 border-r bg-muted/40 h-[calc(100vh-3.5rem)] sticky top-14"
            ${isOpen ? "" : "hidden md:block"}
          `}
        >
          <div className="space-y-4 py-4">
            <DashboardNav />
          </div>
        </aside>
        <main className="container mx-auto flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
