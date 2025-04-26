"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isQueryRoute = pathname === "/docs/query";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onMenuClick={() => {
          if (isQueryRoute) {
            // Handle chat drawer in query route
            const chatDrawerButton = document.querySelector('[data-chat-drawer-button]');
            if (chatDrawerButton instanceof HTMLElement) {
              chatDrawerButton.click();
            }
          } else {
            // Handle navigation drawer in other routes
            setSidebarOpen(!sidebarOpen);
          }
        }} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {!isQueryRoute && <Sidebar isOpen={sidebarOpen} />}
        
        <motion.main 
          className={cn(
            "flex-1 overflow-auto p-4 md:p-6",
            isQueryRoute ? "pl-0" : ""
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={cn(
            "max-w-7xl mx-auto",
            isQueryRoute ? "h-full" : ""
          )}>
            {children}
          </div>
        </motion.main>
      </div>
      
      <Footer />
    </div>
  );
}