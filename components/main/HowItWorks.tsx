
import { FileText, UserCog, CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Solicita tu estudio gratuito",
    icon: <FileText size={64} strokeWidth={1.5}/>,
  },
  {
    title: "Recibe una propuesta personalizada",
    icon: <UserCog size={64} strokeWidth={1.5}/>,
  },
  {
    title: "Nosotros nos encargamos del resto",
    icon: <CheckCircle size={64} strokeWidth={1.5}/>
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-24 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Decorative blurred shapes */}
        <div className="absolute w-72 h-72 bg-blue-700 opacity-30 rounded-full blur-3xl left-[-8rem] top-[-8rem]"></div>
        <div className="absolute w-56 h-56 bg-cyan-400 opacity-20 rounded-full blur-2xl right-[-6rem] bottom-[-6rem]"></div>
      </div>
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center drop-shadow-lg">
          Así de fácil es trabajar con nosotros
        </h2>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
                flex-1 flex flex-col items-center text-center bg-white/10 rounded-3xl shadow-xl
                p-8 transition-transform duration-300 hover:-translate-y-3 hover:shadow-2xl
                relative z-10
                ${index % 2 === 1 ? "md:mt-12" : ""}
              `}
            >
              <div className="flex items-center justify-center mb-6 relative">
                <span className="absolute -top-14 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-300 text-blue-950 text-2xl font-semibold rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  {index + 1}
                </span>
                <div className="w-32 h-24 relative rounded-lg overflow-hidden flex items-center justify-center">
                    {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white drop-shadow">
                {step.title}
              </h3>
            </div>
          ))}
          {/* Step connectors for horizontal layout */}
        </div>
      </div>
    </section>
  );
}
