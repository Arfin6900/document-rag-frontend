"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  glowColor?: "purple" | "blue" | "pink";
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, glowColor = "purple", children, ...props }, ref) => {
    const glowClasses = {
      purple: "neon-glow-purple",
      blue: "neon-glow-blue",
      pink: "neon-glow-pink",
    };

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            glowClasses[glowColor],
            className
          )}
          {...props}
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ opacity: 0.5 }}
          />
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";