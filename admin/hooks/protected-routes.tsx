"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
      router.push("/dashboard");
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Ou afficher un indicateur de chargement
  }

  return <>{children}</>;
}
