"use client";

import { registerShareTargetServiceWorker } from "@/lib/pwa/shareTarget";
import { useEffect } from "react";

export function ShareTargetServiceWorker() {
  useEffect(() => {
    registerShareTargetServiceWorker();
  }, []);

  return null;
}
