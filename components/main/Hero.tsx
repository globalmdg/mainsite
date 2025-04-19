import Image from "next/image";
import { Building, Home, DollarSign } from "lucide-react";


const Hero = () => {

  return (
    <section className="bg-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tighter tracking-tight">
            Gestionamos tu Hipoteca para que<br />
            vivas <span className="text-blue-600">sin preocupaciones</span>
          </h1>
          <p className="text-gray-600 mb-8">
            Ahorra tiempo, dinero y estrés con nuestro servicio integral de gestión hipotecaria. Te acompañamos en el proceso y ponemos a tu disposición un equipo de expertos para que consigas la mejor hipoteca para tu nuevo hogar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
            >
              Empieza Ahora
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-blue-600 hover:text-blue-800 rounded-lg text-sm font-medium transition"
            >
              Descarga nuestros servicios
            </a>
          </div>

          <div className="text-gray-400 text-sm uppercase mb-2">Trabajamos con los mejores</div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex gap-1 items-center">
              <DollarSign className="w-5 h-5 text-blue-950" />
              <div>Bancos</div>
            </div>
            <div className="flex gap-1 items-center">
              <Building className="w-5 h-5 text-blue-950" />
              <div>Constructores</div>
            </div>
            <div className="flex gap-1 items-center">
              <Home className="w-5 h-5 text-blue-950" />
              <div>Arquitectos</div>
            </div>

          </div>
        </div>

        {/* Right Side: Image */}
        <div className="rounded-[2rem] overflow-hidden shadow-lg">
          <Image
            src="/hero.jpg"
            alt="Hero Image"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
export default Hero