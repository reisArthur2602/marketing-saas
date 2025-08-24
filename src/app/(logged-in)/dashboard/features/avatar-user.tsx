"use client";

import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "next-auth/react";
import { User } from "next-auth";

interface AvatarUserProps {
  user: User;
}

const getInitials = (name: string) => {
  if (!name) return "US";
  const [first = "", second = ""] = name.trim().split(" ");
  return `${first.charAt(0)}${second.charAt(0) || ""}`.toUpperCase();
};

export const AvatarUser = ({ user }: AvatarUserProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage src={user.image || "./avatar.jpg"} alt="Profile image" />
          <AvatarFallback>{getInitials(user.name as string)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {user.name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          <LogOutIcon size={16} className="mr-2 opacity-60" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
