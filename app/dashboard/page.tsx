'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardApp from "@/app/dashboardApp";

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Force re-login on page refresh
    try {
      const perf = (performance as any)?.getEntriesByType?.("navigation") || [];
      const isReload = Array.isArray(perf) && perf[0]?.type === "reload";
      if (isReload) {
        fetch("/api/auth/logout", { method: "POST" }).finally(() => {
          router.replace("/login");
        });
        return;
      }
    } catch {
      /* ignore */
    }
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/login", { method: "GET" });
        if (res.ok) {
          setChecked(true);
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    }
    checkSession();
  }, [router]);

  if (!checked) return null;
  return <DashboardApp />;
}
