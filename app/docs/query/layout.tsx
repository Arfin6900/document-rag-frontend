"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Menu } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import apis from "apis";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Chat {
  id?: string;
  name: string;
  created_at: string;
  user_id: string;
  contexts: string[];
  provider: string;
  is_active: boolean;
}

export default function QueryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [newChatName, setNewChatName] = useState("");

  const [chats, setChats] = useState<Chat[]>([]);

  const { mutate: deleteChat, isPending: isDeleting } = useMutation({
    mutationFn: (chatId: string) => {
      return apis.deleteChat(chatId);
    },
  });
  
  const { mutate: createChat, isPending: isCreating } = useMutation({
    mutationFn: (chat: Chat) => {
      return apis.createChat(chat);
    },
    onSuccess: ({data}) => {
      setIsNewChatDialogOpen(false);
      setNewChatName("");
      getChats();
      router.push(`/docs/query?id=${data?.chat_room_id}`);
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });

  const {mutate: getChats} = useMutation({
    mutationFn: () => {
      return apis.getChats();
    },
    onSuccess: (data) => {
      setChats(data.data);
    },
    onError: (error) => {
      console.error("Error getting chats:", error);
    },
  });

  const handleChatSelect = (chatId: string) => {
    router.push(`/docs/query?id=${chatId}`);
    setIsDrawerOpen(false);
  };

  const handleNewChat = () => {
    setIsNewChatDialogOpen(true);
  };

  const handleCreateChat = () => {
    if (!newChatName.trim()) return;
    
    createChat({
      name: newChatName.trim(),
      created_at: new Date().toISOString(),
      user_id: "1",
      contexts: [],
      provider: "gemini",
      is_active: true,
    });
  };

  // Close drawer when route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    getChats();
  }, []);

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Mobile Drawer Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          data-chat-drawer-button
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Chat List Sidebar */}
        <div
          className={cn(
            "fixed md:relative w-64 h-[calc(100vh-4rem)] border-r border-border p-4 flex flex-col bg-background lg:z-0 z-40 transition-transform duration-300",
            isDrawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Chats</h2>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNewChat}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className={cn(
                  "p-3 cursor-pointer transition-colors",
                  chatId === chat.id
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted/50"
                )}
                onClick={() => handleChatSelect(chat.id!)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{chat.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(chat.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Overlay for mobile */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

        {/* New Chat Dialog */}
        <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat</DialogTitle>
              <DialogDescription>
                Enter a name for your new chat. The default AI provider will be Gemini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Chat Name</Label>
                <Input
                  id="name"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  placeholder="Enter chat name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChat} disabled={!newChatName.trim() || isCreating}>
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
} 