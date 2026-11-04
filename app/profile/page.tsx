"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { CalendarDays, CheckCircle2, Link2, Mail } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import ProfilePasswordSettings from "@/components/ProfilePasswordSettings";
import Link from "next/link";
import { getUserData, restoreUserSession, updateProfile, type PublicUser } from "@/lib/authHelper";

function errorText(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { error?: unknown; message?: unknown } | string | undefined;
    const message = typeof data === "string" ? data : data?.error ?? data?.message;
    if (typeof message === "string" && message.length < 220) return message;
  }
  return "Мэдээлэл хадгалахад алдаа гарлаа. Дахин оролдоно уу.";
}

export default function ProfilePage() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    let active = true;
    void restoreUserSession().then((restored) => {
      if (!active) return;
      if (!restored) {
        router.replace("/login?next=%2Fprofile");
        return;
      }
      setUser(restored);
      setUsername(restored.username);
      setLoading(false);
    });
    const onAuthChange = () => {
      const latest = getUserData();
      if (!latest) router.replace("/login?next=%2Fprofile");
      else {
        setUser(latest);
        setUsername(latest.username);
      }
    };
    window.addEventListener("retevis:auth-changed", onAuthChange);
    return () => {
      active = false;
      window.removeEventListener("retevis:auth-changed", onAuthChange);
    };
  }, [router]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = await updateProfile(username);
      setUser(updated);
      setUsername(updated.username);
      setSuccess("Нэр амжилттай шинэчлэгдлээ.");
    } catch (reason) {
      setError(errorText(reason));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <main className="site-container min-h-[65vh] py-10 sm:py-14" aria-busy="true">
        <div className="mx-auto max-w-3xl">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-52 animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
      </main>
    );
  }

  const initial = user.username.trim().charAt(0).toLocaleUpperCase("mn-MN") || "R";
  const memberSince = user.createdAt && !Number.isNaN(new Date(user.createdAt).getTime())
    ? new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "long" }).format(new Date(user.createdAt))
    : null;

  return (
    <main className="site-container min-h-[65vh] py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 sm:mb-8">
          <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow/50">
            <ArrowLeft className="h-4 w-4" /> Дэлгүүр рүү буцах
          </Link>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Retevis Mongolia</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Миний профайл</h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">Бүртгэлийн мэдээллээ харах, шинэчлэх.</p>
        </div>

        <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5 sm:p-7">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">{initial}</div>
              <div className="min-w-0">
                <h2 className="truncate font-semibold text-slate-900">{user.username}</h2>
                <p className="truncate text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 py-5">
              <h3 className="text-base font-semibold text-slate-900">Үндсэн мэдээлэл</h3>
              <label className="block space-y-2 text-sm font-medium text-slate-700" htmlFor="profile-username">
                Хэрэглэгчийн нэр
                <Input id="profile-username" value={username} onChange={(event) => setUsername(event.target.value)} minLength={2} maxLength={80} autoComplete="username" required disabled={saving} className="h-10 rounded-lg border-slate-200 bg-white px-3 focus-visible:ring-yellow/40" />
              </label>
              <div className="flex items-start gap-2 text-sm text-slate-500">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{user.email} · Имэйл хаягийг эндээс өөрчлөх боломжгүй.</span>
              </div>
              {memberSince && <p className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" />Бүртгүүлсэн: {memberSince}</p>}
              {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
              {success && <p className="flex items-center gap-2 text-sm text-green-700" role="status"><CheckCircle2 className="h-4 w-4" />{success}</p>}
              <Button type="submit" disabled={saving || username.trim() === user.username} className="h-10 w-full rounded-lg sm:w-auto">
                {saving ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}
              </Button>
            </form>

            <div className="border-t border-slate-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-slate-500" />
                <h3 className="text-base font-semibold text-slate-900">Google бүртгэл</h3>
              </div>
              {user.googleLinked ? (
                <p className="flex items-center gap-2 text-sm text-green-700"><CheckCircle2 className="h-4 w-4" />Google хаяг холбогдсон</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-slate-500">Google хаягаа холбоод дараа нь Google-ээр нэвтэрч болно. Баталгаажсан имэйл нь энэ бүртгэлийн имэйлтэй таарч, та саяхан нэвтэрсэн байх шаардлагатай.</p>
                  <GoogleSignInButton mode="link" />
                </div>
              )}
            </div>

            <ProfilePasswordSettings email={user.email} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

