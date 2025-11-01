"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusIcon, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react";

interface Chat {
  thread_id: string;
}

interface SidebarProps {
  chats: Chat[];
  onNewChat: () => void;
  onSelectChat: (thread_id: string) => void;
  onDeleteChat: (thread_id: string) => void;
  isCollapsed: boolean;
}

export function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
  onDeleteChat,
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
          className="w-full justify-center rounded-none"
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
            // To remove the bounding box, just remove the "border" class from the div below.
            <div
              key={chat.thread_id}
              className="flex items-center group border rounded-none"
            >
              <Button
                variant="ghost"
                className="w-full justify-start flex-1"
                onClick={() => onSelectChat(chat.thread_id)}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                {!isCollapsed && (
                  <span className="truncate">
                    {chat.thread_id.substring(0, 8)}...
                  </span>
                )}
              </Button>
              {!isCollapsed && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => onDeleteChat(chat.thread_id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
