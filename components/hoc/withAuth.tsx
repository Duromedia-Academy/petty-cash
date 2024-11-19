"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // For client-side routing
import { useAuth } from "@/components/context/authContext";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ProtectedComponent: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

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
