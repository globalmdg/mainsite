"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

type Props = {
  faqs: FAQItem[]
}

const FAQ = ({ faqs }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index)
  }

  return (
    <section className="w-full px-4 md:px-8 py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                  className="w-full flex justify-between items-center p-4 text-left text-lg font-medium text-gray-800 hover:bg-gray-100 transition"
                  onClick={() => toggle(index)}
                >
                  {faq.question}
                  {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </button>
                <div
                  className={`px-4 pb-4 text-gray-600 text-sm leading-relaxed transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                  {faq.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
