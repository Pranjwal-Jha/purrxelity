import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
              <Avatar>
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
            )}
            <Card
              className={`p-4 rounded-none ${
                message.role === "user"
                  ? "bg-[#24292e] max-w-3xl"
                  : "bg-[#1e1e1e] max-w-5xl"
              }`}
            >
              {" "}
              <div className="prose dark:prose-invert max-w-full">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const [isCopied, setIsCopied] = useState(false);
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "text";

                      const handleCopy = () => {
                        const codeString = String(children).replace(/\n$/, "");
                        navigator.clipboard.writeText(codeString);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      };

                      return !inline ? (
                        <div className="relative my-4 rounded-md text-sm border">
                          <div className="flex items-center justify-between rounded-t-md bg-zinc-900/50 px-4 py-2">
                            <span className="text-zinc-400">{language}</span>
                            <button
                              onClick={handleCopy}
                              className="text-zinc-400 hover:text-white"
                            >
                              {isCopied ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={language}
                            PreTag="div" // Using div for better styling flexibility
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-muted px-1 rounded-md" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </Card>
            {message.role === "user" && (
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
