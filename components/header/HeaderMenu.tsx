import Link from "next/link"

type Props = {
  type: string;
}
const HeaderMenu = (props: Props) => {
  const MENU_ITEMS = [
    { label: "La Empresa", path: "/empresa" },
    { label: "Servicios", path: "/servicios" },
    { label: "Proyectos", path: "/proyectos" },
    { label: "Contacto", path: "/contacto" },
  ]
  return (
    <div>
      <div className={`flex  text-slate-700 ${props.type === "dekstop" ? "text-lg gap-8" : "flex-col text-base gap-1 "}`}>
        {MENU_ITEMS.map((item, index) => (
          <Link key={index} href={item.path} className={`${props.type === "desktop" ? "" : "bg-teal-600 font-semibold text-white py-2 px-4 rounded-md :bg-blue-400"}`}>{item.label}</Link>))}
      </div>
    </div>
  )
}
export default HeaderMenu