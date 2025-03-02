"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Database, FileText, Zap, ArrowRight } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { GlowCard } from "@/components/ui/glow-card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background particles */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
      </div>
      
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-block"
          >
            <Database className="h-16 w-16 md:h-24 md:w-24 text-primary mx-auto animate-pulse-glow" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 text-gradient">
            RAG Document System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern document management system with powerful RAG capabilities
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        >
          <FeatureCard
            icon={<Database className="h-10 w-10 text-neon-purple" />}
            title="Document Management"
            description="Upload, organize, and manage your documents with ease"
            delay={0.4}
            onClick={() => router.push("/docs")}
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-neon-blue" />}
            title="Smart Queries"
            description="Ask questions about your documents and get accurate answers"
            delay={0.5}
            onClick={() => router.push("/docs/query")}
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-neon-pink" />}
            title="Dashboard"
            description="View insights and analytics about your document collection"
            delay={0.6}
            onClick={() => router.push("/dashboard")}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12"
        >
          <AnimatedButton
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 text-lg rounded-lg"
            glowColor="purple"
            onClick={() => router.push("/dashboard")}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </AnimatedButton>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground z-10">
        <p>© 2025 RAG Document System. All rights reserved.</p>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  onClick: () => void;
}

function FeatureCard({ icon, title, description, delay, onClick }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-all duration-300"
      onClick={onClick}
    >
      <div className="mb-4">{icon}</div>
      <h2 className="text-xl font-heading font-bold mb-2 neon-text-purple">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

function ParticleBackground() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
            y: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: Math.random() * 6 + 2 + "px",
            height: Math.random() * 6 + 2 + "px",
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
    </div>
  );
}