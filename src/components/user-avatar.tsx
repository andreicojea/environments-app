import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar(user: { name: string; image?: string }) {
  const userInitials = (user.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Avatar className="h-8 w-8">
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback>{userInitials}</AvatarFallback>
    </Avatar>
  );
}
