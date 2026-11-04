"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/authHelper";

import { toast } from "sonner";
import UserModal from "@/components/Users/UserModal";
import UserTable from "@/components/Users/UserTable";
import { Button } from "@/components/ui/button";
import { CircleAlert, Plus, RefreshCw, Users } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/types/Users";
import { DELETE, GET, POST, PUT } from "@/apis/axios";

function AdminUsersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await GET({ route: `/api/user` });
      if (response.status === 200) {
        setUsers(response.data.users);
      } else {
        throw new Error("Хэрэглэгчдийн мэдээлэл татаж чадсангүй.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Хэрэглэгчдийн мэдээлэл татаж чадсангүй.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (deleting) return;
    setDeleting(true);
    try {
      const response = await DELETE({
        route: `/api/user/${id}`,
      });

      if (response.status === 200) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("Хэрэглэгчийг амжилттай устгалаа.");
        setIsDialogOpen(false);
        setUserToDelete(null);
      } else {
        throw new Error("Хэрэглэгчийг устгаж чадсангүй.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Хэрэглэгчийг устгаж чадсангүй.");
    } finally {
      setDeleting(false);
    }
  };

  const updateUser = async (user: User) => {
    const safeUser: Partial<User> = { ...user };
    delete safeUser.password;
    const response = await PUT({ route: `/api/user/${encodeURIComponent(user._id)}`, body: safeUser });
    if (response.status !== 200) throw new Error("Хэрэглэгчийг шинэчилж чадсангүй.");
    setUsers((prev) => prev.map((item) => (item._id === user._id ? response.data : item)));
    toast.success("Хэрэглэгч амжилттай шинэчлэгдлээ.");
    setEditUser(null);
  };

  const addUser = async (user: User) => {
    const response = await POST({ route: "/api/user", body: user });
    if (response.status !== 201) throw new Error("Хэрэглэгчийг нэмж чадсангүй.");
    setUsers((prev) => [...prev, response.data]);
    toast.success("Хэрэглэгч амжилттай нэмэгдлээ.");
    setNewUser(null);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!(await isAdmin())) {
        router.push("/");
      } else {
        await fetchUsers();
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-800"><Users className="h-5 w-5" /></span><div><h2 className="text-lg font-semibold text-slate-900">Хэрэглэгчийн бүртгэл</h2><p className="mt-1 text-sm text-slate-500">{loading ? "Мэдээлэл татаж байна…" : `${users.length} хэрэглэгчийн бүртгэл`}</p></div></div>
        <Button onClick={() => setNewUser({ _id: "", username: "", email: "", password: "", isAdmin: false })} className="w-full sm:w-auto"><Plus />Хэрэглэгч нэмэх</Button>
      </section>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loadError ? <div className="flex flex-col items-center gap-3 px-4 py-12 text-center"><CircleAlert className="h-8 w-8 text-amber-700" /><p className="max-w-md text-sm text-slate-600">{loadError}</p><Button variant="outline" onClick={() => void fetchUsers()}><RefreshCw />Дахин оролдох</Button></div> : loading ? <div className="space-y-3 p-5">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-lg bg-slate-100" />)}</div> : (
          <UserTable user={users} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </section>

      <AlertDialog open={isDialogOpen} onOpenChange={(open) => { if (!deleting) setIsDialogOpen(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Та энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Та энэ хэрэглэгчийг устгахдаа
              итгэлтэй байна уу?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} onClick={() => setIsDialogOpen(false)}>
              Цуцлах
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={() => {
                if (userToDelete) {
                  deleteUser(userToDelete);
                }
              }}
            >
              {deleting ? "Устгаж байна…" : "Устгах"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editUser && (
        <UserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={updateUser}
        />
      )}

      {newUser && (
        <UserModal
          user={newUser}
          onClose={() => setNewUser(null)}
          onSave={addUser}
        />
      )}
    </div>
  );
}

export default AdminUsersPage;
