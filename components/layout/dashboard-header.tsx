import { UserNav } from "@/components/layout/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { useMobileSidebarToggle } from "@/components/context/mobileSidebarContext";
import { Menu, X } from "lucide-react";

export function DashboardHeader() {
  const { isOpen, setIsOpen } = useMobileSidebarToggle();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between px-6 h-14 items-center">
        <div className="flex">
          <a className="hidden md:flex items-center" href="/dashboard">
            <span className="font-bold">Petty Cash Manager</span>
          </a>
          <div className="block md:hidden">
            {isOpen ? (
              <X className="h-6 w-6" onClick={() => setIsOpen(!isOpen)} />
            ) : (
              <Menu className="h-6 w-6" onClick={() => setIsOpen(!isOpen)} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
