// components/mortgage/ResultsSection.tsx
"use client";

type ResultsSectionProps = {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
};

export default function ResultsSection({
  monthlyPayment,
  totalPaid,
  totalInterest,
}: ResultsSectionProps) {
  return (
    <section className="mt-12 p-6 md:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Resultado de tu hipoteca
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-primary">Cuota mensual</h3>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {monthlyPayment.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-primary">Total a pagar</h3>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            {totalPaid.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-primary">Total en intereses</h3>
          <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            {totalInterest.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
