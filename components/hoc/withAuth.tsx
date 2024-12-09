"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // For client-side routing
import { useAuth } from "@/components/context/authContext";
import { useToast } from "@/components/ui/use-toast";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    const { user, loading, role } = useAuth();
    const pathname = usePathname();
    const { toast } = useToast();
    const router = useRouter();

    if (role !== "administrator" && pathname === "/dashboard/users") {
      toast({
        variant: "destructive",
        title: "Authorization Error",
        description: "You are not authorized to view this page.",
      });
      router.push("/dashboard"); // Redirect to dashboard if user is not authorized to view this page
    }

    useEffect(() => {
      if (!loading && !user) {
        router.push("/signin"); // Redirect to login if user is not authenticated
      }
    }, [loading, user, router]);

    if (loading) {
      return <div>Loading...</div>; // Optionally, render a loading spinner
    }

    return user ? <WrappedComponent {...props} /> : null;
  };

  return ProtectedComponent;
};

export default withAuth;
