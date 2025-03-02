"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  FileText, 
  Upload, 
  Search, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const documentStats = [
  { name: "PDF", value: 65 },
  { name: "TXT", value: 35 },
];

const queryData = [
  { name: "Mon", queries: 12 },
  { name: "Tue", queries: 19 },
  { name: "Wed", queries: 15 },
  { name: "Thu", queries: 25 },
  { name: "Fri", queries: 32 },
  { name: "Sat", queries: 18 },
  { name: "Sun", queries: 10 },
];

const recentQueries = [
  { id: 1, query: "What are the key findings in the Q2 report?", timestamp: "2 hours ago" },
  { id: 2, query: "Summarize the project proposal", timestamp: "5 hours ago" },
  { id: 3, query: "Extract financial data from annual report", timestamp: "1 day ago" },
  { id: 4, query: "Compare performance metrics between Q1 and Q2", timestamp: "2 days ago" },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold neon-text-purple">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your document system</p>
          </div>
          
          <Tabs defaultValue="overview" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="glass">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Documents"
            value="124"
            description="+12 from last week"
            icon={<FileText className="h-5 w-5" />}
            trend="up"
            delay={0.1}
          />
          <StatsCard 
            title="Uploaded Today"
            value="8"
            description="+3 from yesterday"
            icon={<Upload className="h-5 w-5" />}
            trend="up"
            delay={0.2}
          />
          <StatsCard 
            title="Total Queries"
            value="356"
            description="+42 from last week"
            icon={<Search className="h-5 w-5" />}
            trend="up"
            delay={0.3}
          />
          <StatsCard 
            title="System Status"
            value="Healthy"
            description="All systems operational"
            icon={<CheckCircle2 className="h-5 w-5" />}
            trend="neutral"
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading">Query Activity</CardTitle>
              <CardDescription>Number of queries over the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 30, 50, 0.8)', 
                      borderColor: 'hsl(var(--primary))',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                  <Bar 
                    dataKey="queries" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    className="animate-pulse-glow"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="font-heading">Document Types</CardTitle>
              <CardDescription>Distribution by file format</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {documentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="animate-pulse-glow" />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 30, 50, 0.8)', 
                      borderColor: 'hsl(var(--primary))',
                      borderRadius: '8px',
                      color: 'white'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="font-heading">Recent Queries</CardTitle>
            <CardDescription>Your latest document queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQueries.map((query, index) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-2 rounded-full bg-primary/10">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{query.query}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{query.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  delay: number;
}

function StatsCard({ title, value, description, icon, trend, delay }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-heading font-bold mt-2 neon-text-purple">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
          {trend === "up" && (
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>{description}</span>
            </div>
          )}
          {trend === "down" && (
            <div className="flex items-center text-red-500">
              <ArrowUpRight className="h-3 w-3 mr-1 rotate-180" />
              <span>{description}</span>
            </div>
          )}
          {trend === "neutral" && (
            <div className="flex items-center text-muted-foreground">
              <span>{description}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}