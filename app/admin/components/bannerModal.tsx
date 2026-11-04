"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Banner } from "@/types/Banner";
import { compressImage } from "@/lib/compressImage";

interface BannerModalProps {
  banner: Banner | null;
  onClose: () => void;
  onSave: (newBanner: Banner, files: File[]) => Promise<void>;
}

const BannerModal: React.FC<BannerModalProps> = ({
  banner,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Banner>({
    _id: banner?._id || "",
    image: banner?.image || "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Handle the image selection and preview
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      event.target.value = "";
      if (!newFiles.length) return;
      setIsCompressing(true);
      try {
        const compressedFile = await compressImage(newFiles[0]);
        setUploadedFiles([compressedFile]);
        setFormData((prev) => ({ ...prev, image: URL.createObjectURL(compressedFile) }));
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // Handle save action
  const handleSave = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Зураг сонгох шаардлагатай.");
      return;
    } else {
      try {
        await onSave(formData, uploadedFiles); // Passing actual file(s)
        onClose(); // Close the modal after saving
      } catch {
        toast.error("Хадгалах явцад алдаа гарлаа.");
      }
    }
  };

  // Remove the selected image
  const removeImage = () => {
    setFormData({ ...formData, image: "" });
    setUploadedFiles([]); // Clear the uploaded files array
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Banner Image
            </label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={handleImageChange}
              disabled={isCompressing}
              className="border-0 mt-1 px-0 block shadow-none w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-500 mt-1">Large photos are compressed before upload when your browser supports it.</p>
            <div className="flex space-x-4 mt-4">
              {formData.image && (
                <div className="relative">
                  <Image
                    src={formData.image} // Blob URL for preview
                    alt="Banner Image"
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <button
                    className="bg-red-500 rounded-full shadow-none hover:scale-105 top-0 right-0 absolute"
                    onClick={removeImage}
                  >
                    <Image
                      src="/icons/xicon.svg"
                      height={20}
                      width={20}
                      alt="Close"
                      color="bg-white"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button className="hover:underline" onClick={onClose}>
              Болих
            </button>
            <Button className="text-white" onClick={handleSave} disabled={isCompressing}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerModal;
