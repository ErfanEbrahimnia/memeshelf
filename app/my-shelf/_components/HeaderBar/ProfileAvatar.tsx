"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export function ProfileAvatar({
  imageUrl,
  alt,
  isLoading = false,
  className,
}: ProfileAvatarProps) {
  const showImage = !!imageUrl && !isLoading;

  return (
    <Avatar className={cn("size-9 bg-muted", className)}>
      {showImage && (
        <AvatarImage src={imageUrl} alt={alt} referrerPolicy="no-referrer" />
      )}
      <AvatarFallback className="size-9">
        <User className="size-4 text-muted-foreground" aria-hidden />
      </AvatarFallback>
    </Avatar>
  );
}

interface ProfileAvatarProps {
  imageUrl?: string | null;
  alt: string;
  isLoading?: boolean;
  className?: string;
}
