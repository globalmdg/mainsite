"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CallToAction = () => {
  return (
    <section className="mt-10 mb-10 bg-gradient-to-br from-indigo-600 to-purple-600 py-14 px-6 sm:px-12 text-white rounded-3xl shadow-xl mx-4 md:mx-auto max-w-5xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">
            ¿Listo para encontrar tu hipoteca ideal?
          </h2>
          <p className="text-sm sm:text-base opacity-90">
            Comienza ahora y compara diferentes escenarios para tomar la mejor decisión financiera.
          </p>
        </div>
        <Link
          href="/calculadora"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-indigo-100 transition duration-300"
        >
          Estudio Gratuito <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  )
}

export default CallToAction
