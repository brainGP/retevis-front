import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Нууцлалын бодлого",
  description: "Retevis Mongolia сайтад хувийн мэдээллийг хэрхэн ашиглаж, хамгаалах тухай.",
  alternates: { canonical: "/privacy" },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    <div className="space-y-2 leading-7 text-slate-700">{children}</div>
  </section>
);

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <article className="site-container mx-auto max-w-4xl space-y-7 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Нууцлалын бодлого</h1>
          <p className="text-sm text-slate-500">Сүүлд шинэчилсэн: 2026 оны 11 дүгээр сарын 5</p>
          <p className="leading-7 text-slate-700">Энэ бодлого нь Retevis Mongolia (цаашид “бид”, “манай сайт” гэх) нь retevis.mn сайтаар дамжуулан таны мэдээллийг хэрхэн цуглуулж, ашиглаж, хамгаалахыг тайлбарлана.</p>
        </header>

        <Section title="Бидний цуглуулж болох мэдээлэл">
          <p>Та бүртгэл үүсгэх үед хэрэглэгчийн нэр, имэйл хаяг болон нууц үг өгнө. Google-ээр нэвтрэх эсвэл Google хаягаа холбох үед Google-ээс баталгаажуулсан имэйл хаяг, профайлын нэр, тухайн Google хаягийг таних дугаар зэрэг нэвтрэлтэд шаардлагатай мэдээллийг авна. Бид таны Google нууц үгийг авдаггүй.</p>
          <p>Сагсны бүтээгдэхүүн, тоо ширхэгийг таны төхөөрөмжийн хөтчийн дотоод хадгалалтад хадгалж болно. Сайтыг ашиглах явцад төхөөрөмж, хөтчийн болон хүсэлтийн техникийн мэдээлэл серверийн бүртгэлд дамжиж болзошгүй.</p>
        </Section>

        <Section title="Мэдээллийг ашиглах зорилго">
          <p>Мэдээллийг хэрэглэгчийн бүртгэл үүсгэх, нэвтрэлтийг баталгаажуулах, Google хаяг холбох, нууц үгийн баталгаажуулалтын код илгээх, хүсэлтэд хариулах, сайт болон үйлчилгээний аюулгүй байдлыг хангах зорилгоор ашиглана.</p>
        </Section>

        <Section title="Google нэвтрэлт ба үйлчилгээ үзүүлэгчид">
          <p>Google нэвтрэлт ашиглавал Google таны мэдээллийг өөрийн нууцлалын бодлогын дагуу боловсруулна. Бид нэвтрэлт, имэйл хүргэлт, өгөгдөл хадгалалт болон сайтын ажиллагаанд шаардлагатай дэд бүтэц, үйлчилгээ үзүүлэгчдийг ашиглаж болно. Эдгээр үйлчилгээтэй зөвхөн тухайн зорилгод шаардлагатай мэдээлэл дамжуулагдана.</p>
        </Section>

        <Section title="Хадгалалт ба хамгаалалт">
          <p>Бүртгэлтэй холбоотой мэдээллийг үйлчилгээ үзүүлэхэд шаардлагатай хугацаанд хадгална. Нууц үгийг хамгаалсан хэлбэрээр хадгалах болон зөвшөөрөлгүй хандалтаас сэргийлэх зохих арга хэмжээ авдаг. Интернэтээр мэдээлэл дамжуулах, цахим хадгалалтын аль ч арга бүрэн эрсдэлгүй байх баталгаа боломжгүй.</p>
        </Section>

        <Section title="Таны сонголт ба хүсэлт">
          <p>Та Google хаягаа өөрийн профайлаас салгах, эсвэл бүртгэл болон мэдээлэлтэй холбоотой хүсэлт гаргах бол доорх холбоо барих мэдээллээр бидэнд хандана уу. Хөтчийн тохиргоогоор дотоод хадгалалтыг цэвэрлэж болно. Ингэснээр сагсны хадгалсан мэдээлэл устаж болно.</p>
        </Section>

        <Section title="Холбоо барих">
          <p>Retevis Mongolia<br />Утас: <a className="underline" href="tel:+97699021617">(+976) 9902-1617</a><br />Имэйл: <a className="underline" href="mailto:retevismongolia@gmail.com">retevismongolia@gmail.com</a><br />Хаяг: ХУД, Энхтайваны гүүрийн баруун урд, Төв Хаан банкны эсрэг талд, Улаанбаатар, Монгол Улс.</p>
          <p>Үйлчилгээний нөхцөлийг <Link className="underline" href="/terms">эндээс</Link> уншина уу.</p>
        </Section>
      </article>
      <Footer />
    </>
  );
}
