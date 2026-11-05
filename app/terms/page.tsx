import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Үйлчилгээний нөхцөл",
  description: "Retevis Mongolia сайтыг ашиглах үйлчилгээний нөхцөл.",
  alternates: { canonical: "/terms" },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    <div className="space-y-2 leading-7 text-slate-700">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <>
      <Header />
      <article className="site-container mx-auto max-w-4xl space-y-7 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Үйлчилгээний нөхцөл</h1>
          <p className="text-sm text-slate-500">Сүүлд шинэчилсэн: 2026 оны 11 дүгээр сарын 5</p>
          <p className="leading-7 text-slate-700">retevis.mn сайтад нэвтрэх, бүртгэл үүсгэх эсвэл ашиглахдаа эдгээр нөхцөлийг дагаж мөрдөнө. Хэрэв та нөхцөлийг зөвшөөрөхгүй бол сайтыг ашиглахаа зогсооно уу.</p>
        </header>

        <Section title="Үйлчилгээний тухай">
          <p>Retevis Mongolia нь холбооны радио станц болон дагалдах хэрэгслийн мэдээлэл, каталогийг хүргэж, бүтээгдэхүүн сонгох боломж олгодог. Сайт дахь сагс нь сонгосон барааг хөтөч дээр хадгалдаг туслах хэрэгсэл юм. Захиалга, төлбөр, хүргэлтийн нөхцөлийг бидэнтэй шууд холбогдон баталгаажуулна.</p>
        </Section>

        <Section title="Бүртгэл ба Google нэвтрэлт">
          <p>Бүртгэл үүсгэхдээ үнэн зөв мэдээлэл оруулж, нэвтрэх мэдээллээ бусдад дамжуулахгүй байх үүрэгтэй. Google-ээр нэвтрэхэд Google-ийн нэвтрэлтийн нөхцөл, бодлого мөн үйлчилнэ. Таны бүртгэлийг ашиглан хийсэн үйлдэлд та хариуцлага хүлээнэ.</p>
        </Section>

        <Section title="Бүтээгдэхүүний мэдээлэл">
          <p>Бид бүтээгдэхүүний зураг, тайлбар, үнэ болон бусад мэдээллийг аль болох үнэн зөв байлгахыг зорьдог. Гэвч мэдээлэлд алдаа, хуучирсан үнэ эсвэл нөөцийн өөрчлөлт гарч болно. Захиалга баталгаажихаас өмнө үнэ, нөөц, хүргэлт болон төлбөрийн нөхцөлийг бидэнтэй нягтална уу.</p>
        </Section>

        <Section title="Зөвшөөрөгдөх хэрэглээ">
          <p>Сайтыг хууль бус зорилгоор ашиглах, бусдын бүртгэлд зөвшөөрөлгүй нэвтрэх, үйлчилгээний хэвийн ажиллагааг алдагдуулах, эсвэл сайт дахь агуулгыг зөвшөөрөлгүйгээр хуулбарлан ашиглахыг хориглоно.</p>
        </Section>

        <Section title="Үйлчилгээний өөрчлөлт ба хариуцлага">
          <p>Бид сайт, бүтээгдэхүүний мэдээлэл болон үйлчилгээг шинэчлэх, түр зогсоох эрхтэй. Сайтыг ашиглах боломжгүй болох, гуравдагч талын үйлчилгээний доголдол, эсвэл мэдээллийн алдаанаас үүдэх үр дагаврыг холбогдох хууль тогтоомжийн хүрээнд авч үзнэ. Эдгээр нөхцөл нь хэрэглэгчийн хуулиар олгогдсон эрхийг хязгаарлахгүй.</p>
        </Section>

        <Section title="Нөхцөлийн шинэчлэл ба холбоо барих">
          <p>Үйлчилгээ өөрчлөгдөх эсвэл шаардлага гарах үед эдгээр нөхцөлийг шинэчилж болно. Шинэ хувилбарыг энэ хуудсанд нийтэлснээр хүчинтэй болно.</p>
          <p>Асуух зүйл байвал Retevis Mongolia-тай <a className="underline" href="tel:+97699021617">(+976) 9902-1617</a> утсаар эсвэл <a className="underline" href="mailto:retevismongolia@gmail.com">retevismongolia@gmail.com</a> имэйлээр холбогдоно уу.</p>
          <p>Хувийн мэдээллийн талаар <Link className="underline" href="/privacy">Нууцлалын бодлого</Link>-оос уншина уу.</p>
        </Section>
      </article>
      <Footer />
    </>
  );
}
