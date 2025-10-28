"use client";
import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { Sidebar } from "@/components/chat/sidebar";
import { v4 as uuidv4 } from "uuid";

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

  const handleSendMessage = async () => {
    if (input.trim() === "" || !activeThreadId) return;

    const currentChat = chats.find((c) => c.thread_id === activeThreadId);
    const oldMessages = currentChat ? currentChat.messages : [];

    const newMessages: Message[] = [
      ...oldMessages,
      { role: "user", content: input },
    ];

    // Update state immediately for better UX
    setChats(
      chats.map((chat) =>
        chat.thread_id === activeThreadId
          ? { ...chat, messages: newMessages }
          : chat,
      ),
    );
    setInput("");

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

      if (!response.ok) {
        throw new Error("API request failed");
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let lastMessage = "";

      // Find the index of the current chat to update it efficiently
      const chatIndex = chats.findIndex((c) => c.thread_id === activeThreadId);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        lastMessage += chunk;

        // Update the messages for the active chat as the stream comes in
        setChats((currentChats) =>
          currentChats.map((chat, index) => {
            if (index === chatIndex) {
              // Check if the last message is from the assistant and update it
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
                // Otherwise, add a new assistant message
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
      // Revert to old messages on failure
      setChats(
        chats.map((chat) =>
          chat.thread_id === activeThreadId
            ? { ...chat, messages: oldMessages }
            : chat,
        ),
      );
    }
  };

  const activeChat = chats.find((c) => c.thread_id === activeThreadId);

  return (
    <ChatLayout>
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isCollapsed={false} // You can manage this state if you want the toggle to work
      />
      <ChatMessages messages={activeChat ? activeChat.messages : []} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
      />
    </ChatLayout>
  );
}
