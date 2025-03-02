"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogProps,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AnimatedModalProps extends DialogProps {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
}

export const AnimatedModal = forwardRef<HTMLDivElement, AnimatedModalProps>(
  ({ title, description, className, contentClassName, children, ...props }, ref) => {
    return (
      <Dialog {...props}>
        <AnimatePresence>
          {props.open && (
            <DialogContent
              ref={ref}
              className={cn(
                "glass border-primary/20 overflow-hidden",
                contentClassName
              )}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className={className}
              >
                {(title || description) && (
                  <DialogHeader>
                    {title && <DialogTitle className="font-heading">{title}</DialogTitle>}
                    {description && <DialogDescription>{description}</DialogDescription>}
                  </DialogHeader>
                )}
                {children}
              </motion.div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>
    );
  }
);

AnimatedModal.displayName = "AnimatedModal";