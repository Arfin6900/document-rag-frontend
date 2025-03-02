"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 30, 50, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(176, 38, 255, 0.3)',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#00FFFF',
              secondary: '#000',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF10F0',
              secondary: '#000',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}