import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

interface ChatLayoutProps {
  children: ReactNode;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function ChatLayout({ children, isSidebarCollapsed, onToggleSidebar }: ChatLayoutProps) {
  // The children will be an array: [Sidebar, ChatMessages, ChatInput]
  const [sidebar, messages, input] = Array.isArray(children)
    ? children
    : [null, children, null];

  return (
    <main className="flex h-screen bg-background">
      {sidebar && (
        <div
          className={`transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          {sidebar}
        </div>
      )}
      <div className="flex flex-1 flex-col border-l">
        <header className="p-2 border-b text-center sticky top-0 bg-background z-10 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
          >
            {isSidebarCollapsed ? (
              <PanelRightClose className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">Purrxelity AI</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">{messages}</div>
        {input}
      </div>
    </main>
  );
}
