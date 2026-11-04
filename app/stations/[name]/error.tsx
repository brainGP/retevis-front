"use client";

export default function ProductError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center" role="alert">
      <h1 className="text-xl font-semibold">Бүтээгдэхүүний мэдээллийг татаж чадсангүй.</h1>
      <p>Холболтоо шалгаад дахин оролдоно уу.</p>
      <button className="rounded border px-4 py-2 hover:bg-gray/5" onClick={reset}>Дахин оролдох</button>
    </div>
  );
}
