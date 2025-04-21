// components/mortgage/MortgageForm.tsx

"use client";

import { useState, useEffect } from "react";
import { Slider } from "./Slider";

type MortgageFormProps = {
  onSubmit: (data: {
    price: number;
    downPayment: number;
    interestRate: number;
    term: number;
  }) => void;
};

export default function MortgageForm(props: MortgageFormProps) {
  const [formData, setFormData] = useState({
    price: 200000,
    downPayment: 40000,
    interestRate: 3.5,
    term: 30,
    type: "fija",
  });

  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  // Update down payment when % changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      downPayment: (prev.price * downPaymentPercent) / 100
    }));
  }, [downPaymentPercent]);

  const handlePriceChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      price: value,
      downPayment: (value * downPaymentPercent) / 100
    }));
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;

  //   if (name === "price" || name === "downPayment" || name === "interestRate" || name === "term") {
  //     setFormData({
  //       ...formData,
  //       [name]: parseFloat(value) || 0,
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   }
  // };

  const handleDownPaymentPercentChange = (value: number) => {
    setDownPaymentPercent(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const data = {
        price: formData.price,
        downPayment: formData.downPayment,
        interestRate: formData.interestRate,
        term: formData.term,
      };
      props.onSubmit(data);
      setIsLoading(false);
    }, 800);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <section id="mortgage-form" className="bg-gray-50 dark:bg-gray-900 p-4 md:p-10 rounded-2xl shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
        Calcula tu hipoteca
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Price Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="font-medium text-gray-700 dark:text-gray-300">
              Precio de la vivienda
            </label>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(formData.price)}
            </span>
          </div>
          <Slider
            min={50000}
            max={1000000}
            step={5000}
            value={formData.price}
            onChange={handlePriceChange}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>50.000€</span>
            <span>1.000.000€</span>
          </div>
        </div>

        {/* Down Payment Slider - by percentage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Entrada inicial
            </label>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(formData.downPayment)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {downPaymentPercent}% del precio
              </span>
            </div>
          </div>
          <Slider
            min={5}
            max={50}
            step={1}
            value={downPaymentPercent}
            onChange={handleDownPaymentPercentChange}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de interés anual
            </label>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formData.interestRate}%
            </span>
          </div>
          <Slider
            min={1}
            max={10}
            step={0.1}
            value={formData.interestRate}
            onChange={(value) => setFormData(prev => ({ ...prev, interestRate: value }))}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1%</span>
            <span>10%</span>
          </div>
        </div>

        {/* Term Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plazo de amortización
            </label>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formData.term} años
            </span>
          </div>
          <Slider
            min={5}
            max={40}
            step={1}
            value={formData.term}
            onChange={(value) => setFormData(prev => ({ ...prev, term: value }))}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>5 años</span>
            <span>40 años</span>
          </div>
        </div>

        {/* Mortgage Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de hipoteca
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["fija", "variable", "mixta"].map((type) => (
              <button
                key={type}
                type="button"
                className={`p-3 cursor-pointer hover:drop-shadow-md text-center rounded-lg border transition-all ${formData.type === type
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                  }`}
                onClick={() => setFormData({ ...formData, type })}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`cursor-pointer w-full px-6 py-4 rounded-xl bg-primary text-white font-semibold text-lg shadow-lg hover:bg-primary/90 transition
              ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculando...
              </span>
            ) : (
              "Calcular cuota mensual"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}