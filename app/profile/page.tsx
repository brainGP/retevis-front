"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { CalendarDays, CheckCircle2, Link2, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GoogleSignInButton from "@/components/GoogleSignInButton";
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
    return <main className="mx-auto min-h-[60vh] max-w-3xl px-4 py-16" aria-busy="true"><div className="h-8 w-48 animate-pulse rounded bg-slate-200" /><div className="mt-6 h-56 animate-pulse rounded-xl bg-slate-100" /></main>;
  }

  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-4 py-10 md:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">Хэрэглэгчийн булан</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Миний профайл</h1>
        <p className="mt-2 text-slate-600">Бүртгэлийн мэдээлэл болон нэвтрэх аргаа удирдана уу.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" />Үндсэн мэдээлэл</CardTitle>
          <CardDescription>Харагдах нэрээ шинэчилж болно. Имэйл хаягийг одоогоор өөрчлөх боломжгүй.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium" htmlFor="profile-username">
              Хэрэглэгчийн нэр
              <Input id="profile-username" value={username} onChange={(event) => setUsername(event.target.value)} minLength={2} maxLength={80} autoComplete="username" required disabled={saving} />
            </label>
            <div className="flex items-start gap-3 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" /><span><strong className="text-slate-800">{user.email}</strong><br />Имэйл солих баталгаажуулалтын урсгал одоогоор тохируулагдаагүй.</span>
            </div>
            {user.createdAt && <p className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" />Бүртгүүлсэн: {new Date(user.createdAt).toLocaleDateString("mn-MN")}</p>}
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            {success && <p className="flex items-center gap-2 text-sm text-green-700" role="status"><CheckCircle2 className="h-4 w-4" />{success}</p>}
            <Button type="submit" disabled={saving || username.trim() === user.username}>{saving ? "Хадгалж байна..." : "Өөрчлөлт хадгалах"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5" />Google бүртгэл</CardTitle>
          <CardDescription>{user.googleLinked ? "Google хаяг энэ профайлтай холбогдсон байна." : "Google хаягаа холбоод дараа нь Google-ээр нэвтрэх боломжтой болгоно."}</CardDescription>
        </CardHeader>
        <CardContent>
          {user.googleLinked ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-700"><CheckCircle2 className="h-5 w-5" />Google хаяг холбогдсон</div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Аюулгүй байдлын үүднээс Google-ийн баталгаажсан имэйл нь энэ бүртгэлийн имэйлтэй таарч, саяхан нэвтэрсэн байх шаардлагатай.</p>
              <GoogleSignInButton mode="link" />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

