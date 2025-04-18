// components/TestimonialsSection.jsx
import Image from 'next/image';
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'María García',
      image: '/testimonial1.png',
      quote: 'Gracias a ellos reduje mi cuota mensual en un 20%.',
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      image: '/testimonial2.png',
      quote: 'Profesionales, claros y súper cercanos.',
    },
    {
      id: 3,
      name: 'Laura Martínez',
      image: '/testimonial3.png',
      quote: 'La mejor decisión que tomé fue confiar en su equipo de expertos.',
    },
  ];

  return (
    <section id="testimonios" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Lo que dicen nuestros clientes</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <Image 
                    width={64}
                  height={64}
                  src={testimonial.image} 
                  alt={`${testimonial.name} foto`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <h3 className="font-semibold text-lg text-gray-800">{testimonial.name}</h3>
              </div>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              <div className="mt-4 flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="w-5 h-5 text-yellow-500 fill-current" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;