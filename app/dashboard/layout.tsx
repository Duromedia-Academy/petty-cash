"use client";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import withAuth from "@/components/hoc/withAuth";

// TODO: Replace with actual user data from Firebase Auth
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  role: "administrator",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <DashboardHeader user={mockUser} />
      <div className="flex">
        <aside className="hidden w-64 border-r bg-muted/40 md:block h-[calc(100vh-3.5rem)] sticky top-14">
          <div className="space-y-4 py-4">
            <DashboardNav userRole="administrator" />
          </div>
        </aside>
        <main className="container mx-auto flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};
export default withAuth(DashboardLayout);
