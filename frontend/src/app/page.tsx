"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import Loading from "@/components/Loading";

const LandingPage = () => {
  const router = useRouter();
  
    const { loading, isAuthenticated } = useAuthContext();
  
    useEffect(() => {
      if (!loading && isAuthenticated) {
        router.replace("/vendor/dashboard");
      }
    }, [loading, isAuthenticated, router]);
  
    if (loading) {
      return (
        <Loading />
      );
    }
  return <div>Landing Page</div>;
};

export default LandingPage;
