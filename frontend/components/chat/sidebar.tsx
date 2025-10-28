"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquare } from "lucide-react";

interface Chat {
  thread_id: string;
  // Add other chat properties as needed, e.g., title
}

interface SidebarProps {
  chats: Chat[];
  onNewChat: () => void;
  onSelectChat: (thread_id: string) => void;
  isCollapsed: boolean;
}

export function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
  isCollapsed,
}: SidebarProps) {
  return (
    <div
      className={`flex flex-col h-full bg-muted/50 border-r transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-2">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-center"
        >
          {isCollapsed ? (
            <PlusIcon className="h-5 w-5" />
          ) : (
            <>
              <PlusIcon className="mr-2 h-5 w-5" />
              New Chat
            </>
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.thread_id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectChat(chat.thread_id)}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              {!isCollapsed && (
                <span className="truncate">
                  {chat.thread_id.substring(0, 8)}...
                </span>
              )}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
