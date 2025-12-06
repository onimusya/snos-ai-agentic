"use client";

import { Suspense, useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { RiskReportPanel } from "@/components/chat/risk-report-panel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function ChatContent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const createConversation = useMutation(api.conversations.create);

  // Wait a bit after mount to allow auth state to settle
  useEffect(() => {
    let pollCount = 0;
    const maxPolls = 20;

    const pollInterval = setInterval(() => {
      pollCount++;
      if (isAuthenticated && user) {
        clearInterval(pollInterval);
        setAuthCheckComplete(true);
        return;
      }
      if (pollCount >= maxPolls) {
        clearInterval(pollInterval);
        setAuthCheckComplete(true);
      }
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(pollInterval);
      setAuthCheckComplete(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(pollInterval);
    };
  }, [isLoading, isAuthenticated, user]);

  useEffect(() => {
    if (authCheckComplete && !isLoading && !isAuthenticated) {
      router.push("/auth/login?redirect=/chat");
    }
  }, [authCheckComplete, isLoading, isAuthenticated, router]);

  const handleNewChat = async () => {
    const conversationId = await createConversation({});
    setSelectedConversationId(conversationId);
    setLeftSidebarOpen(false);
  };

  const handleSelectConversation = (id: Id<"conversations">) => {
    setSelectedConversationId(id);
    setLeftSidebarOpen(false);
  };

  if (isLoading || !authCheckComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Mobile Layout: Sheets for sidebars
  const mobileLayout = (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu Buttons */}
        <div className="lg:hidden flex items-center justify-between p-2 border-b border-border">
          <Sheet open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <ChatSidebar
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
              />
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">S.N.O.S. AI</h1>

          <Sheet open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <RiskReportPanel conversationId={selectedConversationId} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedConversationId && (
            <ChatHeader
              conversationId={selectedConversationId}
              showMenuButton={false}
              onReportClick={() => {
                /* TODO: Implement report dialog */
              }}
            />
          )}
          <ChatMessages conversationId={selectedConversationId} />
          <ChatInput
            conversationId={selectedConversationId}
            onMessageSent={() => {
              /* Messages will auto-update via Convex reactivity */
            }}
          />
        </div>
      </div>
    </div>
  );

  // Desktop Layout: Resizable Panels
  const desktopLayout = (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full">
              <ChatSidebar
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Center: Chat Messages and Input */}
          <ResizablePanel defaultSize={55} minSize={40}>
            <div className="h-full flex flex-col">
              {selectedConversationId && (
                <ChatHeader
                  conversationId={selectedConversationId}
                  onReportClick={() => {
                    /* TODO: Implement report dialog */
                  }}
                />
              )}
              <ChatMessages conversationId={selectedConversationId} />
              <ChatInput
                conversationId={selectedConversationId}
                onMessageSent={() => {
                  /* Messages will auto-update via Convex reactivity */
                }}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Sidebar: Risk Report */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full">
              <RiskReportPanel conversationId={selectedConversationId} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden">{mobileLayout}</div>
      {/* Desktop Layout */}
      <div className="hidden lg:block">{desktopLayout}</div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
