import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatAvatarProps {
  role: "user" | "assistant";
}

export function ChatAvatar({ role }: ChatAvatarProps) {
  return (
    <Avatar>
      <AvatarFallback>{role === "user" ? "U" : "B"}</AvatarFallback>
    </Avatar>
  );
}
