"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/authContext";
import Image from "next/image";

interface UserNavProps {
  user: {
    name: string;
    email: string;
    role: string;
    photoURL: string;
    displayName: string;
  };
}

export function UserNav() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const displayName = user?.displayName || "";
  const email = user?.email || "";
  const photoURL = user?.photoURL || "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = "/signin";
      toast({
        title: "Success",
        description: "You have successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {photoURL ? (
              <Image
                src={photoURL}
                alt="User Avatar"
                width="100"
                height="100"
              />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
