import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export const metadata = {
  title: 'Form Page',
};

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Header />
    <div className="max-w-[1150px] mx-auto px-4">
      {children}
    </div>
    <Footer /></>;
}