import { UserNav } from "@/components/layout/user-nav";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex justify-between px-6 h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/dashboard">
            <span className="hidden font-bold sm:inline-block">
              Petty Cash Manager
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}