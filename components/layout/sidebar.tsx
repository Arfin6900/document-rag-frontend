"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Upload, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const sidebarVariants = {
    open: { width: "240px", transition: { duration: 0.3 } },
    closed: { width: "70px", transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        className={cn(
          "h-[calc(100vh-4rem)] border-r border-border/40 glass hidden md:block",
          isOpen ? "w-60" : "w-[70px]"
        )}
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        initial={false}
      >
        <div className="flex flex-col h-full py-4">
          <div className="px-3 py-2">
            <h2 className={cn(
              "font-heading font-medium text-sm text-muted-foreground mb-2 transition-opacity",
              isOpen ? "opacity-100" : "opacity-0"
            )}>
              MAIN MENU
            </h2>
          </div>
          
          <nav className="space-y-1 px-2">
            <SidebarItem 
              href="/dashboard" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="Dashboard" 
              isActive={pathname === "/dashboard"}
              isOpen={isOpen}
            />
            <SidebarItem 
              href="/docs" 
              icon={<FileText className="h-5 w-5" />} 
              label="Documents" 
              isActive={pathname === "/docs"}
              isOpen={isOpen}
            />
            <SidebarItem 
              href="/docs/query" 
              icon={<Search className="h-5 w-5" />} 
              label="Query" 
              isActive={pathname === "/docs/query"}
              isOpen={isOpen}
            />
            <SidebarItem 
              href="/docs/upload" 
              icon={<Upload className="h-5 w-5" />} 
              label="Upload" 
              isActive={pathname === "/docs/upload"}
              isOpen={isOpen}
            />
          </nav>
          
          <div className="mt-auto">
            <div className="px-3 py-2">
              <h2 className={cn(
                "font-heading font-medium text-sm text-muted-foreground mb-2 transition-opacity",
                isOpen ? "opacity-100" : "opacity-0"
              )}>
                SUPPORT
              </h2>
            </div>
            
            <nav className="space-y-1 px-2">
              <SidebarItem 
                href="/settings" 
                icon={<Settings className="h-5 w-5" />} 
                label="Settings" 
                isActive={pathname === "/settings"}
                isOpen={isOpen}
              />
              <SidebarItem 
                href="/help" 
                icon={<HelpCircle className="h-5 w-5" />} 
                label="Help" 
                isActive={pathname === "/help"}
                isOpen={isOpen}
              />
            </nav>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isOpen: boolean;
}

function SidebarItem({ href, icon, label, isActive, isOpen }: SidebarItemProps) {
  return (
    <Link href={href} className="block">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 py-2 h-10 relative group",
          isActive 
            ? "bg-primary/10 text-primary hover:bg-primary/20" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <span className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5 bg-primary transition-opacity",
          isActive ? "opacity-100" : "opacity-0"
        )} />
        
        <span className={cn(
          isActive && isOpen ? "neon-text-purple" : ""
        )}>
          {icon}
        </span>
        
        <span className={cn(
          "transition-opacity whitespace-nowrap",
          isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
        )}>
          {label}
        </span>
      </Button>
    </Link>
  );
}