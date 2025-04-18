// components/FeaturesSection.tsx
import { Lightbulb, PiggyBank, ClipboardList, ThumbsUp } from "lucide-react";

const features = [
  {
    title: "Asesoría Personalizada",
    description: "Te acompañamos en cada paso.",
    icon: Lightbulb,
  },
  {
    title: "Ahorro Garantizado",
    description: "Negociamos mejores condiciones por ti.",
    icon: PiggyBank,
  },
  {
    title: "Gestión Integral",
    description: "Desde el análisis hasta la firma.",
    icon: ClipboardList,
  },
  {
    title: "Sin Complicaciones",
    description: "Nos encargamos de toda la burocracia.",
    icon: ThumbsUp,
  },
];

export default function Features() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-14">
          ¿Por qué elegirnos?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center justify-center mb-4 text-blue-600">
                  <Icon className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
