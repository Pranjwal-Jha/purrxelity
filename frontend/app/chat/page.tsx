"use client";
import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Sidebar } from "@/components/chat/sidebar";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  thread_id: string;
  messages: Message[];
}

const userId = 1;

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDeepThink, setIsDeepThink] = useState(false);

  // Fetch existing chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/users/${userId}/chats`,
        );
        if (response.ok) {
          const existingChats = await response.json();
          setChats(existingChats);
          if (existingChats.length > 0) {
            setActiveThreadId(existingChats[0].thread_id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchChats();
  }, []);

  const handleNewChat = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/users/${userId}/chats`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thread_id: uuidv4(), messages: [] }),
        },
      );
      if (response.ok) {
        const newChat = await response.json();
        setChats([newChat, ...chats]);
        setActiveThreadId(newChat.thread_id);
      }
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const handleSelectChat = (thread_id: string) => {
    setActiveThreadId(thread_id);
  };

  const handleDeleteChat = async (thread_id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/users/${userId}/chats?chat_thread_id=${thread_id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        toast.success("Chat successfully deleted");
        setChats(chats.filter((chat) => chat.thread_id !== thread_id));
        if (activeThreadId === thread_id) {
          setActiveThreadId(chats.length > 1 ? chats[0].thread_id : null);
        }
      } else {
        toast.error("Failed to delete chat");
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || !activeThreadId) return;

    const currentChat = chats.find((c) => c.thread_id === activeThreadId);
    const oldMessages = currentChat ? currentChat.messages : [];

    const newMessages: Message[] = [
      ...oldMessages,
      { role: "user", content: input },
    ];

    setChats(
      chats.map((chat) =>
        chat.thread_id === activeThreadId
          ? { ...chat, messages: newMessages }
          : chat,
      ),
    );
    setInput("");

    if (isDeepThink) {
      // Handle Deep Think API call (non-streaming)
      const thinkingMessage: Message = {
        role: "assistant",
        content: "Thinking...",
      };
      setChats((currentChats) =>
        currentChats.map((chat) =>
          chat.thread_id === activeThreadId
            ? { ...chat, messages: [...newMessages, thinkingMessage] }
            : chat,
        ),
      );

      try {
        const response = await fetch(
          `http://localhost:8000/chat/deep_research`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: input, thread_id: activeThreadId }),
          },
        );

        if (!response.ok) throw new Error("API request failed");

        const result = await response.json();
        const finalMessage: Message = {
          role: "assistant",
          content: result.message,
        };

        setChats((currentChats) =>
          currentChats.map((chat) =>
            chat.thread_id === activeThreadId
              ? { ...chat, messages: [...newMessages, finalMessage] }
              : chat,
          ),
        );
      } catch (error) {
        console.error("Failed to fetch deep research:", error);
        const errorMessage: Message = {
          role: "assistant",
          content: "Sorry, something went wrong with deep research.",
        };
        setChats((currentChats) =>
          currentChats.map((chat) =>
            chat.thread_id === activeThreadId
              ? { ...chat, messages: [...newMessages, errorMessage] }
              : chat,
          ),
        );
      }
    } else {
      // Handle regular streaming API call
      try {
        const response = await fetch(
          `http://localhost:8000/chat/stream?user_id=${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: input, thread_id: activeThreadId }),
          },
        );

        if (!response.ok) throw new Error("API request failed");
        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let lastMessage = "";
        const chatIndex = chats.findIndex(
          (c) => c.thread_id === activeThreadId,
        );

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });
          lastMessage += chunk;

          setChats((currentChats) =>
            currentChats.map((chat, index) => {
              if (index === chatIndex) {
                const lastMsg = chat.messages[chat.messages.length - 1];
                if (lastMsg && lastMsg.role === "assistant") {
                  return {
                    ...chat,
                    messages: [
                      ...chat.messages.slice(0, -1),
                      { ...lastMsg, content: lastMessage },
                    ],
                  };
                } else {
                  return {
                    ...chat,
                    messages: [
                      ...chat.messages,
                      { role: "assistant", content: lastMessage },
                    ],
                  };
                }
              }
              return chat;
            }),
          );
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
        setChats(
          chats.map((chat) =>
            chat.thread_id === activeThreadId
              ? { ...chat, messages: oldMessages }
              : chat,
          ),
        );
      }
    }
  };

  const activeChat = chats.find((c) => c.thread_id === activeThreadId);

  return (
    <ChatLayout
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
    >
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isCollapsed={isSidebarCollapsed}
      />
      <ChatMessages messages={activeChat ? activeChat.messages : []} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isDeepThink={isDeepThink}
        onToggleDeepThink={() => setIsDeepThink(!isDeepThink)}
      />
    </ChatLayout>
  );
}
