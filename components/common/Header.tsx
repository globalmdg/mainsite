"use client"
import HeaderCaller from "../header/HeaderCaller"
import HeaderLogo from "../header/HeaderLogo"
import HeaderMenu from "../header/HeaderMenu"
import { useEffect, useState } from "react"


// type Props = {}
const Header = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])


  const baseClasses = "fixed top-0 w-[1100px] z-50 transition-all duration-300"
  const scrolledClasses = "bg-white/80 backdrop-blur-md shadow-md py-2"
  const defaultClasses = "bg-transparent py-6"


  return (
    <header className={`${baseClasses} ${scrolled ? scrolledClasses : defaultClasses} flex justify-between`}>
      <div className="flex items-center">
        <HeaderLogo />
      </div>
      <div className="mt-3">
        <HeaderMenu />
      </div>
      <div>
        <HeaderCaller />
      </div>
    </header>
  )
}
export default Header