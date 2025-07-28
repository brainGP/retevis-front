"use client";
import { toast } from "sonner";

export default function ContactInfo() {
  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${text} хуулагдсан!`);
      })
      .catch(() => {
        toast.error("Хуулахас алдаа гарлаа. Дахин оролдоно уу!");
      });
  };

  return (
    <div className="flex flex-col items-start">
      <h2 className="text-lg font-semibold">ХОЛБОО БАРИХ</h2>
      <p
        className="text-sm mt-2 cursor-pointer hover:scale-105 duration-300 transition hover:underline break-all whitespace-normal"
        onClick={() => handleCopy("99021617")}
      >
        <strong className="block">Утас:</strong> (+976) 9902-1617
      </p>
      <p
        className="text-sm mt-2 cursor-pointer hover:scale-105 duration-300 transition hover:underline break-all whitespace-normal"
        onClick={() => handleCopy("retevismongolia@gmail.com")}
      >
        <strong className="block">Имэйл:</strong>
        retevismongolia@gmail.com
      </p>
    </div>
  );
}
