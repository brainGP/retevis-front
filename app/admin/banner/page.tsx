"use client";
import React, { useEffect, useState } from "react";
import { getBanners } from "@/apis/banner";
import { toast } from "sonner";
import { notifyCatalogChanged } from "@/lib/catalogCache";
import { Button } from "@/components/ui/button";
import { DELETE } from "@/apis/axios";
import { isAdmin } from "@/lib/authHelper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BannerModal from "../components/bannerModal";
import ConfirmationDialog from "../components/confirmation";
import Image from "next/image";
import { Banner } from "@/types/Banner";
import { uploadNewBanner } from "@/apis/uploads";
import Breadcrumb from "@/components/BreadCrumb";
import Container from "@/components/Container";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BannerPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      if (!(await isAdmin())) {
        router.push("/");
      } else {
        try {
          const bannersData = await getBanners();
          setBanners(bannersData);
        } catch (error) {
          console.error("Error fetching banners:", error);
          toast.error("Error occurred while fetching banners.");
        }
      }
    };
    fetchBanners();
  }, [router]);

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      const response = await DELETE({
        route: `/api/dashboard/${bannerToDelete}`,
      });

      if (response.status === 200) {
        setBanners((prev) =>
          prev.filter((banner) => banner._id !== bannerToDelete)
        );
        notifyCatalogChanged("banners");
        toast.success("Banner deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner.");
    } finally {
      setIsDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleAddBanner = () => {
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (newBanner: Banner, files: File[]) => {
    try {
      if (!files[0]) throw new Error("Зураг сонгоно уу.");
      const banner = await uploadNewBanner(files[0]);
      toast.success("New banner added successfully.");
      setBanners((prev) => [...prev, banner]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  const handleNavigation = (value: string) => {
    switch (value) {
      case "Бүтээгдэхүүн":
        router.push("/admin");
        break;
      case "Хэрэглэгчид":
        router.push("/admin/users");
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
            <Button onClick={() => handleAddBanner()} className="max-w-[140px]">
              Баннер нэмэх
            </Button>
          </div>
          <div className="flex items-center flex-row justify-between gap-4 md:gap-0">
            <Breadcrumb />
            <div className="flex gap-4">
              <Select onValueChange={handleNavigation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Баннер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Хэрэглэгчид">Хэрэглэгчид</SelectItem>
                  <SelectItem value="Хэрэглэгчид">Бүтээгдэхүүн</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Container>

      {isModalOpen && (
        <BannerModal
          banner={{ _id: "", image: "" }}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBanner}
        />
      )}
      <Container>
        <ScrollArea className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableCaption>A list of all banner images.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px] text-center">#</TableHead>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.length > 0 ? (
                banners.map((banner, index) => (
                  <TableRow key={banner._id}>
                    <TableCell className="text-center font-medium">
                      {index + 1}.
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center p-4">
                        <Image
                          src={banner.image}
                          alt={`Banner image ${banner._id}`}
                          width={300}
                          height={300}
                          className="rounded-md"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        className="px-4 py-2 bg-red-500 text-white"
                        onClick={() => {
                          setBannerToDelete(banner._id);
                          setIsDialogOpen(true);
                        }}
                      >
                        Устгах
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No banners available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Container>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Баннер устгах"
        description="Энэ үйлдлийг буцаах боломжгүй. Та энэ баннерыг устгахдаа итгэлтэй байна уу?"
        callback={handleDelete}
        actionLabel="Устгах"
      />
    </div>
  );
};

export default BannerPage;
