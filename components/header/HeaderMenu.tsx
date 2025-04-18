import Link from "next/link"

// type Props = {}
const HeaderMenu = () => {
    const MENU_ITEMS = [
        {label: "La Empresa", path: "/empresa"},
        {label: "Servicios", path: "/servicios"},
        {label: "Proyectos", path: "/proyectos"},
        {label: "Contacto", path: "/contacto"},
    ]
  return (
    <div>
        <div className="flex gap-8 text-slate-700 ">
            {MENU_ITEMS.map((item, index) => (
                <Link key={index} href={item.path}>{item.label}</Link>))}
        </div>
    </div>
  )
}
export default HeaderMenu