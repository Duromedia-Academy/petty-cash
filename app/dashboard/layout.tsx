"use client";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import withAuth from "@/components/hoc/withAuth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <div className="flex">
        <aside className="hidden w-64 border-r bg-muted/40 md:block h-[calc(100vh-3.5rem)] sticky top-14">
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
