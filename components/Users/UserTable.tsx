import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserActions } from "./UserActions";
import { User } from "@/types/Users";
import { UserRound } from "lucide-react";

interface UserTableProps {
  user: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ user = [], onEdit, onDelete }) => (
  <div className="w-full overflow-x-auto">
    <Table className="min-w-[650px]">
      <TableHeader className="bg-slate-50/80"><TableRow className="hover:bg-transparent"><TableHead className="w-16 text-center">#</TableHead><TableHead>Хэрэглэгч</TableHead><TableHead>Эрхийн түвшин</TableHead><TableHead className="text-right">Үйлдэл</TableHead></TableRow></TableHeader>
      <TableBody>
        {user.length ? user.map((item, index) => <TableRow key={item._id}>
          <TableCell className="text-center text-sm tabular-nums text-slate-500">{index + 1}</TableCell>
          <TableCell><div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">{item.username?.trim().charAt(0).toLocaleUpperCase("mn-MN") || "R"}</span><div className="min-w-0"><p className="truncate font-medium text-slate-900">{item.username}</p><p className="truncate text-xs text-slate-500">{item.email}</p></div></div></TableCell>
          <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${item.isAdmin ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-600"}`}>{item.isAdmin ? "Админ" : "Хэрэглэгч"}</span></TableCell>
          <TableCell><div className="flex justify-end"><UserActions user={item} onEdit={onEdit} onDelete={onDelete} /></div></TableCell>
        </TableRow>) : <TableRow><TableCell colSpan={4} className="h-44"><div className="flex flex-col items-center justify-center gap-2 text-center"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500"><UserRound className="h-5 w-5" /></span><p className="font-medium text-slate-800">Хэрэглэгч олдсонгүй</p><p className="text-sm text-slate-500">Энэ бүртгэлд одоогоор хэрэглэгч алга.</p></div></TableCell></TableRow>}
      </TableBody>
    </Table>
    <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">{user.length.toLocaleString("mn-MN")} хэрэглэгч</p>
  </div>
);

export default UserTable;
