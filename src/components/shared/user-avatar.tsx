import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, CircleUserRound } from "lucide-react";
import { User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "picture" | "name">;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const loaderSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function UserAvatar({
  user,
  size = "md",
  className,
  ...props
}: UserAvatarProps) {
  const { status } = useSession();
  const loaderClass = loaderSizes[size] ?? loaderSizes.md;
  const iconClass = iconSizes[size] ?? iconSizes.md;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Avatar
        {...props}
        className={cn(`size-${size}`, "flex items-center justify-center")}
      >
        {user.picture ? (
          status === "loading" ? (
            <div
              className="flex items-center justify-center w-full h-full"
              aria-label="Loading avatar"
            >
              <Loader
                className={cn("animate-spin text-gray-500", loaderClass)}
              />
            </div>
          ) : (
            <AvatarImage alt={`${user.name}'s avatar`} src={user.picture} />
          )
        ) : (
          <AvatarFallback className="flex items-center justify-center w-full h-full">
            <CircleUserRound className={iconClass} />
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
}
