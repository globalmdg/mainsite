"use client";

import { useState } from "react"

import CallToAction from "@/components/calculadora/CallToAction"
import FAQ from "@/components/calculadora/FAQ"
import HeroSection from "@/components/calculadora/HeroSection"
import MortgageForm from "@/components/calculadora/MortgageForm"
import ResultsSection from "@/components/calculadora/ResultsSection"
import ScenarioComparison from "@/components/calculadora/ScenarioComparison"
import TimelineVisualizer from "@/components/calculadora/TimelineVisualizer"
import { useMortgageCalculator } from "@/hooks/useMortgageCalculator";

type MortgageFormData = {
  price: number;
  downPayment: number;
  interestRate: number;
  term: number;
};

const Calculadora = () => {
  const [formData, setFormData] = useState<MortgageFormData | null>(null);

  const {
    monthlyPayment,
    totalPaid,
    totalInterest,
    breakdown,
  } = useMortgageCalculator(
    formData ?? {
      price: 0,
      downPayment: 0,
      interestRate: 0,
      term: 1,
    }
  );

  // Generate Scenarios for Comparision 
  const scenarios = [
    {
      title: "Escenario 1",
      monthlyPayment: monthlyPayment,
      totalPayment: totalPaid,
      interestRate: formData?.interestRate ?? 0,
      loanTerm: formData?.term ?? 1,
    },
    {
      title: "Escenario 2",
      monthlyPayment: monthlyPayment * 1.1, // Example modification
      totalPayment: totalPaid * 1.1,
      interestRate: formData?.interestRate ?? 0,
      loanTerm: formData?.term ?? 1,
    },
    {
      title: "Escenario 3",
      monthlyPayment: monthlyPayment * 0.9, // Example modification
      totalPayment: totalPaid * 0.9,
      interestRate: formData?.interestRate ?? 0,
      loanTerm: formData?.term ?? 1,
    }
  ];


  const faqItems = [
    {
      question: "¿Qué es una hipoteca fija?",
      answer: "Una hipoteca fija mantiene el mismo tipo de interés durante toda la vida del préstamo, ofreciendo cuotas mensuales constantes.",
    },
    {
      question: "¿Puedo amortizar anticipadamente mi hipoteca?",
      answer: "Sí, aunque algunas entidades aplican una comisión por amortización anticipada. Consulta con tu banco.",
    },
    {
      question: "¿Cuál es la diferencia entre TIN y TAE?",
      answer: "TIN es el tipo de interés nominal, mientras que TAE incluye comisiones y refleja el coste real del préstamo.",
    },
  ]


  return (
    <div>
      <HeroSection />
      <MortgageForm onSubmit={setFormData} />
      {formData && (
        <>
          <ResultsSection
            monthlyPayment={monthlyPayment}
            totalPaid={totalPaid}
            totalInterest={totalInterest}
          />
          <TimelineVisualizer breakdown={breakdown} />
          <ScenarioComparison scenarios={scenarios} />
          <FAQ faqs={faqItems} />
        </>
      )}
      <CallToAction />
    </div>

  )
}
export default Calculadora