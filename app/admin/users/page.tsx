"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/authHelper";

import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import Breadcrumb from "@/components/BreadCrumb";
import { LoadingError } from "@/components/LoadingError";
import UserModal from "@/components/Users/UserModal";
import UserTable from "@/components/Users/UserTable";

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
import Container from "@/components/Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AdminUsersPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const response = await GET({ route: `/api/user` });
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch {
      toast.error("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await DELETE({
        route: `/api/user/${id}`,
      });

      if (response.status === 200) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success("Хэрэглэгчийг амжилттай устгалаа.");
      }
    } catch {
      toast.error("Хэрэглэгчийг устгаж чадсангүй.");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const updateUser = async (user: User) => {
    try {
      const response = await PUT({
        route: `/api/user/${user._id}`,
        body: user,
      });
      if (response.status === 200) {
        setUsers((prev) =>
          prev.map((item) => (item._id === user._id ? response.data : item))
        );
        toast.success("Хэрэглэгч амжилттай шинэчилсэн.");
        setEditUser(null);
      }
    } catch {
      toast.error("Хэрэглэгчийг шинэчилж чадсангүй.");
    }
  };

  const addUser = async (user: User) => {
    try {
      const response = await POST({
        route: `/api/user`,
        body: user,
      });
      if (response.status === 201) {
        setUsers((prev) => [...prev, response.data]);
        toast.success("Хэрэглэгчийг амжилттай нэмлээ.");
        setNewUser(null);
      }
    } catch {
      toast.error("Хэрэглэгчийг нэмж чадсангүй.");
    }
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

  const handleNavigation = (value: string) => {
    switch (value) {
      case "Бүтээгдэхүүн":
        router.push("/admin");
        break;
      case "Баннер":
        router.push("/admin/banner");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full top-0 border-b px-4 md:px-6 mb-8 py-4">
      <Container>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row  justify-between">
            <h1 className="font-semibold text-xl mb-4">
              Админы хэрэглэгчдийг хянах хэсэг
            </h1>
          </div>
          <div className="flex flex-row justify-between items-center gap-4 md:gap-0">
            <Breadcrumb />

            <div className="flex gap-4">
              <Select onValueChange={handleNavigation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Хэрэглэгчид" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Баннер">Баннер</SelectItem>
                  <SelectItem value="Бүтээгдэхүүн">Бүтээгдэхүүн</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Container>
      <Container>
        <ScrollArea className="w-full h-min-96 overflow-auto border rounded-lg">
          <UserTable user={users} onEdit={handleEdit} onDelete={handleDelete} />
        </ScrollArea>
      </Container>

      <LoadingError isLoading={loading} />

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Цуцлах
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete) {
                  deleteUser(userToDelete);
                }
              }}
            >
              Устгах
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
