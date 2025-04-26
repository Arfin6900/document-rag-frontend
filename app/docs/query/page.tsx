"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  FileText,
  ChevronDown,
  ChevronUp,
  Bot,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import apis from "apis";
import { useSearchParams } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chat_room_id?: string;
  sources?: {
    id: string;
    fileName: string;
    content: string;
    relevance: number;
  }[];
};

type ModelType = "gpt-4" | "gemini-pro";

export default function QueryPage() {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("id");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<ModelType>("gpt-4");
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  const { mutate: getChatMessages, isPending: isLoadingChats } = useMutation<
  { data: any[] },
  Error,
  string  
>({
  mutationFn: (params) => apis.getChatMessages(params),
  onSuccess: (data:any) => {
    setMessages(data.data);
  },
  onError: (error) => {
    toast.error('Failed to fetch chat messages');
    console.error('Error fetching chat messages:', error);
  },
});
  // Fetch chat messages when chatId changes
  useEffect(() => {
    if (chatId) {
      getChatMessages(chatId);
    }
  }, [chatId]);

  const { mutate: generateLLmResponse, isPending: isLoading2 } = useMutation<
  { data: any[] },
  Error,
  { query: string,top_k:number,chat_room_id:string,document_name:string,user_id:string }  
>({
  mutationFn: (params) => apis.queryDocument(params),
  onSuccess: (data:any) => {
         // Mock response
         const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.data?.data?.results || data.data?.results,
          timestamp: new Date(),
          sources:data.data?.data?.sources?.map((val:any) => ({
            id: val.vector_id,
            fileName: val.docName,
            content: val.content,
            relevance: val.relevance
          })) || [],
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
  },
  onError: (error) => {
    toast.error('Failed to fetch documents');
    console.error('Error fetching documents:', error);
  },
});
  // Scroll to bottom when messages change
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    generateLLmResponse({ query: inputValue, top_k: 3,chat_room_id:chatId || "",document_name:"ArfinResumee",user_id:"1" }); 
  };


  const handleCopyResponse = () => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === "assistant");
    if (lastAssistantMessage) {
      navigator.clipboard.writeText(lastAssistantMessage.content);
      setCopied(true);
      toast.success("Response copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    toast.success("Conversation cleared");
  };

  return (
    <div className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold neon-text-purple">Query Documents</h1>
            <p className="text-muted-foreground">Ask questions about your documents</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={model} onValueChange={(value) => setModel(value as ModelType)}>
              <SelectTrigger className="w-[180px] glass border-primary/20">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="glass border-primary/20">
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              className="glass border-primary/20"
              onClick={handleClearConversation}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100%-6rem)]  lg:h-[calc(100%-3rem)]">
          <div className="flex-grow overflow-y-auto pr-2 space-y-6 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Sparkles className="h-12 w-12 text-primary mb-4 animate-pulse-glow" />
                <h3 className="text-xl font-heading font-medium mb-2">Ask anything about your documents</h3>
                <p className="text-muted-foreground max-w-md">
                  Your questions will be answered based on the content of your uploaded documents
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))
            )}
            
            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-lg glass animate-pulse">
                <div className="p-2 rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                  <div className="h-4 w-64 bg-muted rounded"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="relative">
            {messages.length > 0 && (
              <div className="absolute right-0 -top-12 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass border-primary/20 text-xs"
                  onClick={handleCopyResponse}
                >
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass border-primary/20 text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Ask a question about your documents..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="glass border-primary/20 focus:border-primary/50"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 neon-glow-purple"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: MessageItemProps) {
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  
  const isUser = message.role === "user";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-3xl ${isUser ? "order-2" : "order-1"}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${isUser ? "bg-secondary/10" : "bg-primary/10"} mt-1`}>
            {isUser ? (
              <User className="h-5 w-5 text-secondary" />
            ) : (
              <Bot className="h-5 w-5 text-primary" />
            )}
          </div>
          
          <div>
            <div className={`p-4 rounded-lg ${
              isUser 
                ? "glass border border-secondary/20" 
                : "glass border border-primary/20"
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            
            {message.sources && message.sources.length > 0 && (
              <Collapsible
                open={isSourcesOpen}
                onOpenChange={setIsSourcesOpen}
                className="mt-2"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    {isSourcesOpen ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide sources
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show sources ({message.sources.length})
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-2">
                  {message.sources.map((source) => (
                    <div 
                      key={source.id}
                      className="p-3 rounded-lg bg-muted/30 border border-primary/10"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{source.fileName}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(source.relevance)}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{source.content}</p>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
            
            <div className="text-xs text-muted-foreground mt-1 ml-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}