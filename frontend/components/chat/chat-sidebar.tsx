"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Shield,
  User,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";

// Type for conversation based on the query return type
type Conversation = {
  _id: Id<"conversations">;
  _creationTime: number;
  userId: Id<"users">;
  title: string;
  updatedAt: number;
  messageCount: number;
  riskLevel?: "high" | "medium" | "low";
  riskScore?: number;
};

interface ChatSidebarProps {
  selectedConversationId: Id<"conversations"> | null;
  onSelectConversation: (id: Id<"conversations">) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  selectedConversationId,
  onSelectConversation,
  onNewChat,
}: ChatSidebarProps) {
  const { user } = useAuth();
  const conversations = useQuery(api.conversations.list) || [];
  const createConversation = useMutation(api.conversations.create);
  const deleteConversation = useMutation(api.conversations.remove);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = async () => {
    const conversationId = await createConversation({});
    onSelectConversation(conversationId);
    onNewChat();
  };

  const handleDeleteConversation = async (
    e: React.MouseEvent,
    conversationId: Id<"conversations">
  ) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation?")) {
      await deleteConversation({ conversationId });
      if (selectedConversationId === conversationId) {
        onSelectConversation(null as any);
      }
    }
  };

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getRiskBadgeVariant = (
    riskLevel?: "high" | "medium" | "low"
  ): "default" | "secondary" | "destructive" => {
    switch (riskLevel) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="flex flex-col h-full bg-muted/30 border-r border-border">
      {/* User Info Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.name || user?.email} />
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-400 text-white text-sm font-semibold">
              {getUserInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Badge
          className="w-full justify-center rounded-full"
          variant={
            user?.subscriptionPlan === "free" ? "secondary" : "default"
          }
        >
          <Shield className="h-3 w-3 mr-1" />
          {user?.subscriptionPlan?.charAt(0).toUpperCase() +
            user?.subscriptionPlan?.slice(1) || "Free"}
        </Badge>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-border">
        <Button
          onClick={handleNewChat}
          className="w-full rounded-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            filteredConversations.map((conversation: Conversation) => (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation._id)}
                className={`
                  group relative p-3 rounded-md cursor-pointer mb-1
                  transition-colors
                  ${
                    selectedConversationId === conversation._id
                      ? "bg-foreground text-background"
                      : "hover:bg-muted"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm font-medium truncate">
                        {conversation.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {formatDistanceToNow(conversation.updatedAt, {
                          addSuffix: true,
                        })}
                      </span>
                      {conversation.riskLevel && (
                        <>
                          <span>•</span>
                          <Badge
                            variant={getRiskBadgeVariant(conversation.riskLevel)}
                            className="text-xs px-1.5 py-0"
                          >
                            {conversation.riskLevel}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteConversation(e, conversation._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

