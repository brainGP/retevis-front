"use client";

import React, { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/types/Users";
import { LoaderCircle, UserRound, X } from "lucide-react";

interface UserModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => Promise<void>;
}

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const body = error.response?.data as { message?: unknown; error?: unknown } | string | undefined;
    const message = typeof body === "string" ? body : body?.message ?? body?.error;
    if (typeof message === "string" && message.length < 200) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Хадгалах үед алдаа гарлаа. Мэдээллээ шалгаад дахин оролдоно уу.";
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const isNewUser = !user._id;
  const [formData, setFormData] = useState<User>({ ...user, username: user.username || "", email: user.email || "", password: user.password || "" });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const closeRef = useRef(onClose);
  const savingRef = useRef(false);
  closeRef.current = onClose;
  savingRef.current = saving;

  useEffect(() => {
    setFormData({ ...user, username: user.username || "", email: user.email || "", password: user.password || "" });
  }, [user]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !savingRef.current) closeRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const setField = <K extends keyof User>(field: K, value: User[K]) => setFormData((current) => ({ ...current, [field]: value }));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-slate-950/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="user-modal-title" className="my-auto w-full max-w-xl overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><UserRound className="h-5 w-5" /></span><div><h2 id="user-modal-title" className="text-lg font-semibold text-slate-900">{isNewUser ? "Хэрэглэгч нэмэх" : "Хэрэглэгч засах"}</h2><p className="mt-0.5 text-sm text-slate-500">Нэр, имэйл болон хандах эрхийг тохируулна.</p></div></div>
          <button type="button" aria-label="Хаах" onClick={onClose} disabled={saving} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </header>
        <form onSubmit={submit}>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">Нэр <span className="text-red-600">*</span></span><Input value={formData.username} onChange={(event) => setField("username", event.target.value)} autoComplete="name" maxLength={80} minLength={2} required disabled={saving} className="h-10 rounded-lg border-slate-200" /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">Имэйл <span className="text-red-600">*</span></span><Input type="email" value={formData.email} onChange={(event) => setField("email", event.target.value)} autoComplete="email" maxLength={254} required disabled={saving} className="h-10 rounded-lg border-slate-200" /></label>
            {isNewUser ? <div><Label htmlFor="admin-user-password" className="mb-1.5 block text-sm font-medium text-slate-700">Түр нууц үг <span className="text-red-600">*</span></Label><Input id="admin-user-password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(event) => setField("password", event.target.value)} autoComplete="new-password" minLength={8} maxLength={128} required disabled={saving} className="h-10 rounded-lg border-slate-200" /><p className="mt-1 text-xs text-slate-500">8–128 тэмдэгт. Хэрэглэгч дараа нь профайлаасаа нууц үгээ өөрчилж болно.</p><button type="button" aria-pressed={showPassword} onClick={() => setShowPassword((current) => !current)} className="mt-2 text-xs font-medium text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline">{showPassword ? "Нууц үгийг нуух" : "Нууц үгийг харах"}</button></div> : <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">Нууц үгийг эндээс үзэх, өөрчлөх боломжгүй. Хэрэглэгч профайлаас нууц үгээ шинэчилнэ.</p>}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3"><div><Label htmlFor={`admin-role-${user._id || "new"}`} className="text-sm font-medium text-slate-800">Админ эрх</Label><p className="mt-0.5 text-xs text-slate-500">Удирдлагын хэсэгт нэвтрэх боломж олгоно.</p></div><Switch id={`admin-role-${user._id || "new"}`} checked={Boolean(formData.isAdmin)} onCheckedChange={(checked) => setField("isAdmin", checked)} disabled={saving} /></div>
          </div>
          <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6"><Button type="button" variant="outline" onClick={onClose} disabled={saving} className="sm:min-w-28">Болих</Button><Button type="submit" disabled={saving} className="sm:min-w-32">{saving ? <><LoaderCircle className="animate-spin" />Хадгалж байна…</> : "Хадгалах"}</Button></footer>
        </form>
      </section>
    </div>
  );
};

export default UserModal;
