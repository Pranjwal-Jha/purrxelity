import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
}
