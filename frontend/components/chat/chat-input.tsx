import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, Lightbulb, Paperclip } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => void;
  isDeepThink: boolean;
  onToggleDeepThink: () => void;
}

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
  isDeepThink,
  onToggleDeepThink,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t flex justify-center">
      <div className="w-1/2">
        <div className="rounded-lg border bg-muted focus-within:ring-1 focus-within:ring-ring">
          <TextareaAutosize
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Cmd+Enter to send)"
            className="w-full resize-none border-none bg-transparent px-3 pt-3 shadow-none focus-visible:ring-0 focus-visible:outline-none"
            maxRows={7}
          />
          <div className="flex items-center justify-between gap-1 p-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="border border-zinc-700"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant={isDeepThink ? undefined : "ghost"}
                size="icon"
                onClick={onToggleDeepThink}
                className={`border border-zinc-700 ${isDeepThink ? "bg-[#20808D] text-white hover:bg-[#20808D]/50" : "hover:bg-background"}`}
              >
                <Lightbulb className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Select defaultValue="gemini-2.5-pro">
                <SelectTrigger className="w-[185px] border-zinc-700 rounded-md bg-muted!">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                  <SelectItem value="gemini-2.5-flash">
                    Gemini 2.5 Flash
                  </SelectItem>
                  <SelectItem value="sonnet-4.5">Sonnet 4.5</SelectItem>
                  <SelectItem value="grok-4-fast">Grok 4</SelectItem>
                  <SelectItem value="gpt-5-low">GPT-5</SelectItem>
                  <SelectItem value="qwen3-235b-a22b">
                    Qwen3-235B-A22B
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-white hover:bg-zinc-200 text-black"
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
