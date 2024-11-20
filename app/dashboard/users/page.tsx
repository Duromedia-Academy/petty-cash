"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserDialog } from "@/components/users/UserDialog";
import UserList from "@/components/users/UserList";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/context/authContext";

export default function UsersPage() {
  const [open, setOpen] = useState(false);

 
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <UserList />
      <UserDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
