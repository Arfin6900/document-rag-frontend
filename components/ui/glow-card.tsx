"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Card, CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GlowCardProps extends CardProps {
  glowColor?: "purple" | "blue" | "pink";
  hoverEffect?: boolean;
}

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, glowColor = "purple", hoverEffect = true, children, ...props }, ref) => {
    const glowClasses = {
      purple: "neon-glow-purple",
      blue: "neon-glow-blue",
      pink: "neon-glow-pink",
    };

    return (
      <motion.div
        whileHover={hoverEffect ? { y: -5 } : undefined}
        transition={{ duration: 0.3 }}
      >
        <Card
          ref={ref}
          className={cn(
            "glass border-primary/20 overflow-hidden",
            hoverEffect && "hover:border-primary/50 transition-all duration-300",
            glowClasses[glowColor],
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </motion.div>
    );
  }
);

GlowCard.displayName = "GlowCard";