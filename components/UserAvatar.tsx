import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, SettingsIcon, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/authHelper";
import { toast } from "sonner";

function UserAvatar({ name, isAdmin }: { name: string; picture?: string; isAdmin?: boolean }) {
  const router = useRouter();
  const isUserAdmin = Boolean(isAdmin);

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Амжилттай гарлаа!");
    router.push(`/`);
    router.refresh();
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full p-0"
            aria-label="User menu"
          >
            <Avatar className="bg-slate-300 rounded-full">
              <AvatarFallback className="text-black/85 font-bold">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="max-w-56 truncate">{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <UserRound className="mr-2 h-4 w-4" />
            <span>Миний профайл</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {isUserAdmin && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/admin");
                    router.refresh();
                  }}
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Админ</span>
                  <DropdownMenuShortcut>P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Гарах</span>
            <DropdownMenuShortcut>Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
        <span className="hidden lg:block">{name}</span>
      </DropdownMenu>
    </div>
  );
}

export default UserAvatar;
