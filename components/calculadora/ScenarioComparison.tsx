"use client"
import React, { useState } from "react"
import { Lock, TrendingUp, Calendar, Percent } from "lucide-react"

type Scenario = {
  title: string
  monthlyPayment: number
  totalPayment: number
  interestRate: number
  loanTerm: number // in years
  isRecommended?: boolean
}

type Props = {
  scenarios: Scenario[]
}

const ScenarioComparison = ({ scenarios }: Props) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="w-full px-4 md:px-8 py-10 bg-gradient-to-b from-slate-50 to-white">
      <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Comparativa de Escenarios</h2>
      <p className="text-center text-slate-500 mb-8 max-w-2xl mx-auto">Analiza nuestras opciones de financiación y elige la que mejor se adapte a tus necesidades</p>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {scenarios.map((scenario, idx) => (
          <div
            key={idx}
            className={`border rounded-2xl p-6 relative transition-all duration-300 shadow-lg
              ${idx === 2 ? "overflow-hidden bg-white" :
                hoveredCard === idx ? "transform -translate-y-2 shadow-xl bg-white" :
                  scenario.isRecommended ? "bg-blue-50 border-blue-200" : "bg-white"}`}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {scenario.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-medium">
                Recomendado
              </div>
            )}

            {idx === 2 && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/90 to-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white">
                <div className="bg-white/20 p-4 rounded-full mb-4">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <p className="text-center font-bold text-xl mb-2">
                  Oferta Premium
                </p>
                <p className="text-center font-medium text-white/90 px-6 mb-4">
                  Contactanos para desbloquear esta oferta exclusiva
                </p>
                <button className="cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-2 rounded-lg font-medium">
                  Contactar Ahora
                </button>
              </div>
            )}

            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">{scenario.title}</h3>
              {!scenario.isRecommended && idx !== 2 && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Opción {idx + 1}</span>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-1">Cuota mensual</p>
              <p className="text-3xl font-bold text-slate-800">
                {scenario.monthlyPayment.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
                <span className="text-sm font-normal text-slate-500 ml-1">/mes</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total pagado</p>
                  <p className="font-semibold">
                    {scenario.totalPayment.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Percent size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tasa de interés</p>
                  <p className="font-semibold">{scenario.interestRate}%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Calendar size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Plazo</p>
                  <p className="font-semibold">{scenario.loanTerm} años</p>
                </div>
              </div>
            </div>

            {idx !== 2 && (
              <div className="pt-4 border-t border-slate-100">
                <button className={`w-full py-3 rounded-lg font-medium transition-colors
                  ${scenario.isRecommended ?
                    "bg-blue-600 hover:bg-blue-700 text-white" :
                    "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}>
                  {scenario.isRecommended ? "Seleccionar Recomendado" : "Seleccionar Plan"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center text-slate-500 max-w-xl mx-auto">
        <p className="text-sm">Todos los escenarios están sujetos a aprobación crediticia. Los valores mostrados son aproximados y pueden variar según tu perfil financiero.</p>
      </div>
    </div>
  )
}

export default ScenarioComparison