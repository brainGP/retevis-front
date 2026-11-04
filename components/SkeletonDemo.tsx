"use client";
import { User } from "lucide-react";

import { getUserData, restoreUserSession } from "@/lib/authHelper";
import UserAvatar from "./UserAvatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
  isAdmin: boolean;
  _id: string;
}

export function Profile() {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const loggedInUser = getUserData();
    if (loggedInUser && typeof loggedInUser === "object") {
      setUser(loggedInUser);
    }
    void restoreUserSession().then(setUser);
    const onAuthChanged = () => setUser(getUserData());
    const onStorage = (event: StorageEvent) => {
      if (event.key === "retevis.authChanged") void restoreUserSession().then(setUser);
    };
    window.addEventListener("retevis:auth-changed", onAuthChanged);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("retevis:auth-changed", onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  if (user) {
    return <UserAvatar name={user.username} isAdmin={user.isAdmin} />;
  }

  return (
    <div
      className="relative cursor-pointer group text-zinc-600"
      onClick={() => router.push(`/login`)}
    >
      <div className="flex gap-2 items-center ">
        <User
          className=" group-hover:text-yellow transition-colors duration-200"
          size={24}
        />
        <span className="hidden lg:block text-sm font-medium  group-hover:text-yellow transition-colors duration-200">
          Нэвтрэх
        </span>
      </div>
    </div>
  );
}
