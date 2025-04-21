import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-3">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-xl" />

        <div className="text-2xl font-semibold text-black">MDG Hipotecas</div>
      </Link>
    </div>
  )
}
export default HeaderLogo