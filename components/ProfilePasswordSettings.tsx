"use client";

import { FormEvent, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { CheckCircle2, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POST } from "@/apis/axios";
import { saveUserData, type PublicUser } from "@/lib/authHelper";

function responseMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const body = error.response?.data as { error?: unknown; message?: unknown } | string | undefined;
    const message = typeof body === "string" ? body : body?.error ?? body?.message;
    if (typeof message === "string" && message.length < 220) return message;
  }
  return "Хүсэлтийг гүйцэтгэж чадсангүй. Холболтоо шалгаад дахин оролдоно уу.";
}

export default function ProfilePasswordSettings({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requested, setRequested] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [developmentCode, setDevelopmentCode] = useState("");

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const requestCode = async () => {
    if (sending || resendIn > 0) return;
    setError("");
    setSuccess("");
    setSending(true);
    try {
      const response = await POST({ route: "/api/auth/password/request-code", body: {} });
      setRequested(true);
      setResendIn(Number(response.data.resendInSeconds) || 60);
      setDevelopmentCode(typeof response.data.developmentCode === "string" ? response.data.developmentCode : "");
    } catch (reason) {
      setError(responseMessage(reason));
    } finally {
      setSending(false);
    }
  };

  const setNewPassword = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setError("");
    setSuccess("");
    if (password.length < 8 || password.length > 128) {
      setError("Нууц үг 8–128 тэмдэгт байх шаардлагатай.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Нууц үгүүд таарахгүй байна.");
      return;
    }
    setSaving(true);
    try {
      const response = await POST({
        route: "/api/auth/password/confirm",
        body: { code: code.trim(), password },
      });
      await saveUserData(response.data as PublicUser);
      setPassword("");
      setConfirmPassword("");
      setCode("");
      setRequested(false);
      setDevelopmentCode("");
      setSuccess("Нууц үг амжилттай тохируулагдлаа. Одоо имэйл, нууц үгээр нэвтэрч болно.");
    } catch (reason) {
      setError(responseMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="border-t border-slate-100 pt-5" aria-labelledby="profile-password-heading">
      <div className="mb-3 flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-slate-500" />
        <h3 id="profile-password-heading" className="text-base font-semibold text-slate-900">Нууц үг тохируулах</h3>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-500">{requested ? "Имэйлд ирсэн 6 оронтой кодыг оруулна уу." : "Имэйлээр баталгаажуулах код авч, Google бүртгэлдээ нууц үг үүсгэх эсвэл одоогийн нууц үгээ шинэчилнэ үү."}</p>

      {!requested ? (
        <Button type="button" variant="outline" disabled={sending} onClick={() => void requestCode()} className="h-10 w-full rounded-lg sm:w-auto">
          <Mail className="h-4 w-4" /> {sending ? "Илгээж байна..." : "Баталгаажуулах код авах"}
        </Button>
      ) : (
        <form onSubmit={setNewPassword} className="space-y-3">
          <p className="text-xs text-slate-500">Код илгээх хаяг: <span className="font-medium text-slate-700">{email}</span></p>
          {developmentCode && <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900" role="status">Хөгжүүлэлтийн горимын код: <strong>{developmentCode}</strong></p>}
          <Input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="6 оронтой код" aria-label="Имэйлээр ирсэн баталгаажуулах код" required disabled={saving} className="h-10 rounded-lg border-slate-200" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} maxLength={128} placeholder="Шинэ нууц үг (8–128 тэмдэгт)" aria-label="Шинэ нууц үг" required disabled={saving} className="h-10 rounded-lg border-slate-200" />
          <Input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} maxLength={128} placeholder="Шинэ нууц үг давтах" aria-label="Шинэ нууц үг давтах" required disabled={saving} className="h-10 rounded-lg border-slate-200" />
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={saving || code.length !== 6} className="h-10 w-full rounded-lg sm:w-auto">{saving ? "Хадгалж байна..." : "Нууц үг хадгалах"}</Button>
            <Button type="button" variant="ghost" disabled={sending || resendIn > 0} onClick={() => void requestCode()} className="h-10 w-full rounded-lg text-slate-600 sm:w-auto">
              {sending ? "Дахин илгээж байна..." : resendIn > 0 ? `Код дахин авах (${resendIn})` : "Шинэ код авах"}
            </Button>
          </div>
        </form>
      )}
      {error && !requested && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
      {success && <p className="mt-3 flex items-center gap-2 text-sm text-green-700" role="status"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</p>}
    </section>
  );
}
