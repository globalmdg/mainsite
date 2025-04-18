"use client";

import { useState } from 'react';

const faqs = [
  {
    question: '¿Cuánto cuesta el servicio?',
    answer: 'La primera consulta y el estudio de tu caso son totalmente gratuitos. Solo cobramos si conseguimos mejorar tus condiciones hipotecarias.'
  },
  {
    question: '¿Con qué bancos trabajan?',
    answer: 'Colaboramos con una amplia red de bancos nacionales e internacionales, seleccionando siempre la mejor opción para tu perfil y necesidades.'
  },
  {
    question: '¿Qué documentos necesito?',
    answer: 'Generalmente, solicitamos tu DNI, la escritura de la hipoteca, los últimos recibos de pago y tu última nómina. Te guiaremos en cada paso.'
  },
  {
    question: '¿Puedo usar el servicio si ya tengo una hipoteca?',
    answer: '¡Por supuesto! Nuestro servicio está especialmente pensado para quienes ya tienen una hipoteca y buscan mejorar sus condiciones.'
  },
  // Puedes agregar más preguntas aquí si lo deseas
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

const handleToggle = (idx: number): void => {
    setOpenIndex(openIndex === idx ? null : idx);
};

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow">
              <button
                className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-gray-900 focus:outline-none"
                onClick={() => handleToggle(idx)}
                aria-expanded={openIndex === idx}
              >
                {faq.question}
                <span className="ml-2 text-blue-600">
                  {openIndex === idx ? '−' : '+'}
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-4 text-gray-700 transition-all duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
