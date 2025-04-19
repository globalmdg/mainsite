"use client"
import { useEffect, useState } from "react"
import HeaderCaller from "../header/HeaderCaller"
import HeaderLogo from "../header/HeaderLogo"
import HeaderMenu from "../header/HeaderMenu"
import { Menu, X } from "lucide-react" // Hamburger & close icons from lucide-react

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const baseClasses = "fixed top-0 w-full z-50 transition-all duration-300 flex"
  const scrolledClasses = "bg-white/80 backdrop-blur-md shadow-md py-2"
  const defaultClasses = "bg-transparent py-6"

  return (
    <header className={`${baseClasses} ${scrolled ? scrolledClasses : defaultClasses} justify-center`}>
      <div className="flex justify-between items-center w-full max-w-[1150px] px-4 md:px-8">
        <HeaderLogo />

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <HeaderMenu type="desktop" />
          <HeaderCaller />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md z-40">
          <div className="p-4 border-t border-gray-200">
            <HeaderMenu type="mobile" />
            {/* Optionally include <HeaderCaller /> here too */}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
