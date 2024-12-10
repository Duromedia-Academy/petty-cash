"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // For client-side routing
import { useAuth } from "@/components/context/authContext";
import { useToast } from "@/components/ui/use-toast";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    const { user, loading, role, setLoading } = useAuth();
    const pathname = usePathname();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/signin"); // Redirect to login if user is not authenticated
      } else if (!loading && user) {
        setLoading(false); // Set loading to false when user is authenticated
      }
    }, [loading, user, router]);

    if (loading) {
      return <div>Loading...</div>; // Show loading state while checking authentication
    }

    if (role !== "administrator" && pathname === "/dashboard/users") {
      toast({
        variant: "destructive",
        title: "Authorization Error",
        description: "You are not authorized to view this page.",
      });
      router.push("/dashboard"); // Redirect to dashboard if user is not authorized to view this page
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default withAuth;
