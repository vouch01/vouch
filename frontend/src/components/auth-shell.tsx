import React from "react";
import Image from "next/image";

const AuthShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-end">
      <div className="absolute inset-0 bg-black/90" />
      <div className="absolute inset-0 z-0 opacity-50">
          <Image
            src={"/images/auth-bg.png"}
            alt="Auth background"
            fill
            className="w-full h-full object-cover"
          />
        </div>

      <div className="relative z-10 w-full max-w-md mx-6 lg:mr-20 my-10">
        {children}
      </div>
    </div>
  );
};

export default AuthShell;
