import ContactForm from "@/components/main/ContactForm2"
import CTASection from "@/components/main/CTASection"
import Faqs from "@/components/main/Faq"
import Features from "@/components/main/Features"
import Hero from "@/components/main/Hero"
import HowItWorks from "@/components/main/HowItWorks"
import Testimonials from "@/components/main/Testimonials"

const MainPage = () => {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Faqs/>
      <CTASection />
      <ContactForm />
    </div>
  )
}

export default MainPage