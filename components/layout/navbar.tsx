"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Database, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled ? "glass border-b border-border/40" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link href="/dashboard" className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary animate-pulse-glow" />
            <span className="font-heading font-bold text-xl hidden sm:inline-block neon-text-purple">
              RAG System
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          <NavItem href="/dashboard" active={pathname === "/dashboard"}>
            Dashboard
          </NavItem>
          <NavItem href="/docs" active={pathname.startsWith("/docs")}>
            Documents
          </NavItem>
          <NavItem href="/docs/query" active={pathname === "/docs/query"}>
            Query
          </NavItem>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-primary/20">
                  <AvatarFallback className="bg-muted text-primary">
                    US
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-primary/20">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}

interface NavItemProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavItem({ href, active, children }: NavItemProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`relative px-4 py-2 ${
          active ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {children}
        {active && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            layoutId="navbar-indicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Button>
    </Link>
  );
}