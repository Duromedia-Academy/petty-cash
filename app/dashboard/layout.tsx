import { DashboardNav } from "@/components/layout/dashboard-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";

// TODO: Replace with actual user data from Firebase Auth
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  role: "administrator",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <DashboardHeader user={mockUser} />
      <div className="flex">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="space-y-4 py-4">
            <DashboardNav userRole="administrator" />
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}