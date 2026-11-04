"use client";

import React, { useState, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { saveUserData } from "@/lib/authHelper";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { POST } from "@/apis/axios";
import BackButton from "@/components/BackButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Бүх хэсгийг бөглөх шаардлагатай.");
      return;
    }

    setLoading(true);

    try {
      const response = await POST({
        route: `/api/auth/login`,
        body: { email, password },
      });

      saveUserData(response.data);

      setTimeout(() => {
        toast.success("Амжилттай нэвтэрлээ");
      }, 0);

      if (response.data.isAdmin) {
        router.push("/admin");
        return;
      }

      const requested = new URLSearchParams(window.location.search).get("next") || "";
      router.push(requested.startsWith("/") && !requested.startsWith("//") ? requested : "/");
    } catch (err: unknown) {
      setTimeout(() => {
        if (err instanceof AxiosError && err.response) {
          toast.error("Имэйл эсвэл нууц үг буруу байна.");
        } else {
          toast.error("Гэнэтийн алдаа гарлаа. Дахин оролдоно уу");
        }
      }, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex absolute m-8">
        <BackButton goToHome />
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-6">
        <Image
          src="/Retevis/retevis.png"
          alt="Retevis Logo"
          width={300}
          height={100}
          priority
          className="mb-6"
        />

        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4 text-black">
              <Input
                type="email"
                autoComplete="email"
                placeholder="Имэйл хаяг"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-11 rounded-lg border-slate-200 bg-slate-100 px-4 shadow-none transition-[background-color,border-color,box-shadow] duration-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Нууц үг"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-11 rounded-lg border-slate-200 bg-slate-100 px-4 pr-12 shadow-none transition-[background-color,border-color,box-shadow] duration-200 hover:bg-white focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center rounded-md px-1 text-gray-600 transition-colors duration-150 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <Image
                    src={
                      showPassword
                        ? "/icons/eyeOpen.svg"
                        : "/icons/eyeClose.svg"
                    }
                    alt={showPassword ? "Hide password" : "Show password"}
                    width={16}
                    height={16}
                  />
                </button>
              </div>

              <Button type="submit" size="lg" className="h-11 w-full rounded-lg" disabled={loading}>
                {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
              </Button>

              <Separator />
              <GoogleSignInButton />

              <div className="flex justify-between text-sm text-gray">
                <p>Бүртгүүлээгүй юу?</p>
                <Link
                  href={`/register`}
                  className="text-sky-600 hover:underline"
                >
                  Бүртгэл үүсгэх
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-gray-500 text-sm">
          <span>EN | MN</span>
        </p>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/Auth.png"
          alt="Auth Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
    </div>
  );
};

export default Login;
