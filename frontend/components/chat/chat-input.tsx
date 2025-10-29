import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
}

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t flex justify-center">
      {/* You can change the width here. 'w-1/2' means 50% of the container. */}
      <div className="w-1/2 relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Cmd+Enter to send)"
          /* You can change the height here. 'h-28' is a fixed height. */
          className="h-28 resize-none pr-14"
        />
        <Button
          size="icon"
          className="absolute bottom-3 right-3"
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
