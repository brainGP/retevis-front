"use client";

import React, { useState, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { POST } from "@/apis/axios";
import Image from "next/image";
import BackButton from "@/components/BackButton";

interface Data {
  username: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showsPassword, setShowsPassword] = useState<boolean>(false);
  const [isPasswordMatching, setIsPasswordMatching] = useState<boolean>(true);

  const router = useRouter();

  const validatePassword = (password: string) => {
    return password.length >= 8 && password.length <= 128;
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Бүх хэсгийг бөглөх шаардлагатай.");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Нууц үг 8-128 тэмдэгт байх шаардлагатай."
      );
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Нууц үг таарахгүй байна.");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Имэйлийн формат буруу байна.");
      setLoading(false);
      return;
    }

    try {
      const data: Data = { username, email, password };
      await POST({
        route: `/api/auth/register`,
        body: data,
      });
      toast.success("Амжилттай бүртгэгдлээ");

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (error) {
      const message = "Ямар нэг зүйл буруу болсон. Дахин оролдоно уу.";
      console.log(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
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
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                type="text"
                autoComplete="username"
                placeholder="Нэр"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1)
                  )
                }
                disabled={loading}
                className="p-4 py-2 bg-slate-100 border rounded-lg shadow-none focus:bg-white focus:border transition duration-300"
              />

              <Input
                type="email"
                autoComplete="email"
                placeholder="Цахим хаяг"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="p-4 py-2 bg-slate-100 border rounded-lg shadow-none focus:bg-white focus:border transition duration-300"
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Нууц үг"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="p-4 py-2 bg-slate-100 border rounded-lg shadow-none hover:bg-white focus:border transition duration-300 pr-12"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center focus:outline-none bg-transparent shadow-none hover:bg-transparent"
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
                </Button>
              </div>

              <div className="relative">
                <Input
                  type={showsPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Нууц үг давтах"
                  value={confirmPassword}
                  onChange={(e) => {
                    const input = e.target.value;
                    setConfirmPassword(input);
                    setIsPasswordMatching(password === input);
                  }}
                  disabled={loading}
                  className="p-4 py-2 bg-slate-100 border rounded-lg shadow-none focus:bg-white focus:border transition duration-300 pr-12"
                />
                <Button
                  type="button"
                  onClick={() => setShowsPassword(!showsPassword)}
                  className="absolute inset-y-0 right-4 flex items-center focus:outline-none bg-transparent shadow-none hover:bg-transparent"
                >
                  <Image
                    src={
                      showsPassword
                        ? "/icons/eyeOpen.svg"
                        : "/icons/eyeClose.svg"
                    }
                    alt={showsPassword ? "Hide password" : "Show password"}
                    width={16}
                    height={16}
                  />
                </Button>
                {!isPasswordMatching && (
                  <p className="text-red-500 text-xs mt-1">
                    Нууц үг таарахгүй байна.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Бүртгэгдэж байна..." : "Бүртгүүлэх"}
              </Button>
            </form>
            <Separator />
            <div className="flex flex-row justify-between text-sm mt-4 text-gray">
              <div>Хэдийн бүртгэлтэй?</div>
              <Link href={`/login`} className="text-sky-600 hover:underline">
                Бүртгэлтэй
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className="mt-6 text-gray-500 text-sm">
          <span>EN | MN</span>
        </p>
      </div>

      <div className="hidden md:block w-1/2 relative">
        <div className="relative w-full h-full">
          <Image
            src="/Auth.png"
            alt="Auth Background"
            fill
            objectFit="cover"
            priority
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
