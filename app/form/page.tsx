'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Send, User, Phone, Mail, MapPin, Home, Briefcase, Clock, CheckCircle } from 'lucide-react'
import { z } from 'zod'
import { ES, FR, PT, IT, DE } from 'country-flag-icons/react/3x2'

interface FormData {
  // Screen 1 - Contact Data
  nombre: string
  apellidos: string
  telefono: string
  email: string
  residencia: string
  comoConociste: string

  // Screen 2 - Operation Type
  operacionInteres: string
  numeroTitulares: string

  // Screen 3 - Current Situation
  estadoActual: string
  bancosOperas: string
  preguntadoOtroBroker: string
  viviendaLibreCargas: string
  preguntadoBanco: string

  // Screen 4 - Employment & Financial
  situacionLaboral: string
  tieneDeudas: string
  explicacionDeuda?: string

  // Screen 5 - Availability
  horarioContacto: string[]
  observaciones: string
}

// Screen components moved outside of MortgageForm for better performance and to prevent input focus loss

interface ScreenProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string | string[]) => void;
  errors?: { [key: string]: string };
}

function Screen1({ formData, updateFormData, errors }: ScreenProps) {
  // Country codes for dropdown
  const countryCodes = [
    { code: '+34', flag: ES },
    { code: '+33', flag: FR },
    { code: '+351', flag: PT },
    { code: '+39', flag: IT },
    { code: '+49', flag: DE },
    // Add more as needed
  ]
  let selectedCode = '+34'
  let phoneNumber = formData.telefono
  const match = formData.telefono.match(/^([+][0-9]{1,3})\s?([0-9]*)$/)
  if (match) {
    selectedCode = match[1]
    phoneNumber = match[2]
  }
  const handleCodeChange = (newCode: string) => {
    updateFormData('telefono', `${newCode} ${phoneNumber}`.trim())
    setShowFlags(false)
  }
  const handlePhoneChange = (val: string) => {
    updateFormData('telefono', `${selectedCode} ${val}`.trim())
  }
  const SelectedFlag = countryCodes.find(c => c.code === selectedCode)?.flag || ES;
  // Popover state
  const [showFlags, setShowFlags] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Datos de contacto
        </h2>
        <p className="text-gray-600">Necesitamos algunos datos básicos para contactarte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => updateFormData('nombre', e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Tu nombre"
          />
          {errors?.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellidos" className="text-sm font-medium text-gray-700">Apellidos *</Label>
          <Input
            id="apellidos"
            value={formData.apellidos}
            onChange={(e) => updateFormData('apellidos', e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Tus apellidos"
          />
          {errors?.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono" className="text-sm font-medium text-gray-700 flex items-center">
          <Phone className="mr-2 h-4 w-4 text-gray-500" />
          Teléfono *
        </Label>
        <div className="relative">
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-0.5 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowFlags(v => !v)}
            tabIndex={-1}
            aria-label="Seleccionar país"
          >
            <SelectedFlag title="Bandera" className="w-6 h-4" />
          </button>
          <Input
            id="telefono"
            ref={inputRef}
            value={phoneNumber}
            onChange={e => handlePhoneChange(e.target.value.replace(/\D/g, ''))}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 pl-10"
            placeholder="612345678"
            maxLength={9}
            type="tel"
            autoComplete="tel"
            style={{ paddingLeft: 44 }}
          />
          {showFlags && (
            <div className="absolute left-0 top-12 bg-white border border-gray-200 rounded shadow-lg z-20 flex flex-col w-16">
              {countryCodes.map(({ code, flag: Flag }) => (
                <button
                  key={code}
                  type="button"
                  className={`flex items-center justify-center w-full py-1.5 hover:bg-blue-50 ${selectedCode === code ? 'bg-blue-100' : ''}`}
                  onClick={() => handleCodeChange(code)}
                >
                  <Flag title="Bandera" className="w-6 h-4" />
                </button>
              ))}
            </div>
          )}
        </div>
        {errors?.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
          <Mail className="mr-2 h-4 w-4 text-gray-500" />
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          placeholder="tu@email.com"
        />
        {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="residencia" className="text-sm font-medium text-gray-700 flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-gray-500" />
          ¿Dónde resides? *
        </Label>
        <Input
          id="residencia"
          value={formData.residencia}
          onChange={(e) => updateFormData('residencia', e.target.value)}
          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          placeholder="Ciudad, País"
        />
        {errors?.residencia && <p className="text-red-500 text-xs mt-1">{errors.residencia}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">¿Cómo me has conocido? *</Label>
        <Select value={formData.comoConociste} onValueChange={(value) => updateFormData('comoConociste', value)}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="redes-sociales">Redes sociales</SelectItem>
            <SelectItem value="referido">Me lo recomendó alguien</SelectItem>
            <SelectItem value="publicidad">Publicidad</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {errors?.comoConociste && <p className="text-red-500 text-xs mt-1">{errors.comoConociste}</p>}
      </div>
    </div>
  )
}

function Screen2({ formData, updateFormData, errors }: ScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Home className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tipo de operación
        </h2>
        <p className="text-gray-600">Cuéntanos qué tipo de operación necesitas</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">¿Qué es lo que más te interesa? *</Label>
        <Select value={formData.operacionInteres} onValueChange={(value) => updateFormData('operacionInteres', value)}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compra-vivienda">Compra de vivienda</SelectItem>
            <SelectItem value="refinanciacion">Refinanciación</SelectItem>
            <SelectItem value="inversion">Inversión</SelectItem>
            <SelectItem value="construccion">Construcción</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {errors?.operacionInteres && <p className="text-red-500 text-xs mt-1">{errors.operacionInteres}</p>}
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">¿Cuántos titulares seréis? *</Label>
        <div className="grid grid-cols-1 gap-3">
          {['1', '2', 'Más de 2'].map((option) => (
            <label
              key={option}
              className={`
                flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${formData.numeroTitulares === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <Checkbox
                id={option}
                checked={formData.numeroTitulares === option}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('numeroTitulares', option)
                  }
                }}
                className="mr-3"
              />
              <span className="font-medium">{option}</span>
            </label>
          ))}
        </div>
        {errors?.numeroTitulares && <p className="text-red-500 text-xs mt-1">{errors.numeroTitulares}</p>}
      </div>
    </div>
  )
}

function Screen3({ formData, updateFormData, errors }: ScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <MapPin className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Situación actual
        </h2>
        <p className="text-gray-600">Ayúdanos a entender tu situación actual</p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">¿En qué estado estás? *</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            'Estoy en búsqueda de inmueble',
            'Tengo el inmueble visto',
            'Ya he firmado arras',
            'Solo quiero información'
          ].map((option) => (
            <label
              key={option}
              className={`
                flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${formData.estadoActual === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <Checkbox
                id={option}
                checked={formData.estadoActual === option}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('estadoActual', option)
                  }
                }}
                className="mr-3"
              />
              <span className="font-medium">{option}</span>
            </label>
          ))}
        </div>
        {errors?.estadoActual && <p className="text-red-500 text-xs mt-1">{errors.estadoActual}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bancos" className="text-sm font-medium text-gray-700">¿Con qué bancos operas?</Label>
          <Input
            id="bancos"
            value={formData.bancosOperas}
            onChange={(e) => updateFormData('bancosOperas', e.target.value)}
            className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
            placeholder="Ej: Santander, BBVA, etc."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">¿Has preguntado a otro broker?</Label>
          <Select value={formData.preguntadoOtroBroker} onValueChange={(value) => updateFormData('preguntadoOtroBroker', value)}>
            <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="si">Sí</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          {errors?.preguntadoOtroBroker && <p className="text-red-500 text-xs mt-1">{errors.preguntadoOtroBroker}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">¿Tienes una vivienda libre de cargas?</Label>
          <Select value={formData.viviendaLibreCargas} onValueChange={(value) => updateFormData('viviendaLibreCargas', value)}>
            <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="si">Sí</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          {errors?.viviendaLibreCargas && <p className="text-red-500 text-xs mt-1">{errors.viviendaLibreCargas}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">¿Has preguntado en algún banco? *</Label>
          <Select value={formData.preguntadoBanco} onValueChange={(value) => updateFormData('preguntadoBanco', value)}>
            <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="si">Sí</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
          {errors?.preguntadoBanco && <p className="text-red-500 text-xs mt-1">{errors.preguntadoBanco}</p>}
        </div>
      </div>
    </div>
  )
}

function Screen4({ formData, updateFormData, errors }: ScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
          <Briefcase className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Situación laboral y financiera
        </h2>
        <p className="text-gray-600">Información sobre tu situación profesional</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">¿Cuál es tu situación laboral? *</Label>
        <Select value={formData.situacionLaboral} onValueChange={(value) => updateFormData('situacionLaboral', value)}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="empleado-fijo">Empleado fijo</SelectItem>
            <SelectItem value="empleado-temporal">Empleado temporal</SelectItem>
            <SelectItem value="autonomo">Autónomo</SelectItem>
            <SelectItem value="funcionario">Funcionario</SelectItem>
            <SelectItem value="jubilado">Jubilado</SelectItem>
            <SelectItem value="desempleado">Desempleado</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        {errors?.situacionLaboral && <p className="text-red-500 text-xs mt-1">{errors.situacionLaboral}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">¿Tienes alguna deuda? *</Label>
        <Select value={formData.tieneDeudas} onValueChange={(value) => updateFormData('tieneDeudas', value)}>
          <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200">
            <SelectValue placeholder="Selecciona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="si">Sí</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
        {errors?.tieneDeudas && <p className="text-red-500 text-xs mt-1">{errors.tieneDeudas}</p>}
      </div>

      {formData.tieneDeudas === 'si' && (
        <div className="space-y-2">
          <Label htmlFor="explicacion-deuda" className="text-sm font-medium text-gray-700">Explica la deuda brevemente</Label>
          <Textarea
            id="explicacion-deuda"
            value={formData.explicacionDeuda || ''}
            onChange={(e) => updateFormData('explicacionDeuda', e.target.value)}
            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            placeholder="Describe tu situación de deuda..."
            rows={4}
          />
          {errors?.explicacionDeuda && <p className="text-red-500 text-xs mt-1">{errors.explicacionDeuda}</p>}
        </div>
      )}
    </div>
  )
}

function Screen5({ formData, updateFormData, errors }: ScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
          <Clock className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Disponibilidad
        </h2>
        <p className="text-gray-600">¿Cuándo es el mejor momento para contactarte?</p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">¿En qué horario prefieres que te contacte? *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Mañana (9:00 - 12:00)',
            'Mediodía (12:00 - 15:00)',
            'Tarde (15:00 - 18:00)',
            'Noche (18:00 - 21:00)'
          ].map((horario) => (
            <label
              key={horario}
              className={`
                flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${formData.horarioContacto.includes(horario)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <Checkbox
                id={horario}
                checked={formData.horarioContacto.includes(horario)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData('horarioContacto', [...formData.horarioContacto, horario])
                  } else {
                    updateFormData('horarioContacto', formData.horarioContacto.filter(h => h !== horario))
                  }
                }}
                className="mr-3"
              />
              <span className="font-medium">{horario}</span>
            </label>
          ))}
        </div>
        {errors?.horarioContacto && <p className="text-red-500 text-xs mt-1">{errors.horarioContacto}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones" className="text-sm font-medium text-gray-700">Observaciones / Comentarios</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => updateFormData('observaciones', e.target.value)}
          className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 resize-none"
          placeholder="Cualquier información adicional que consideres importante..."
          rows={5}
        />
        {errors?.observaciones && <p className="text-red-500 text-xs mt-1">{errors.observaciones}</p>}
      </div>
    </div>
  )
}

// Zod schema for form validation
// Update Zod schema for telefono: must be 9 digits, and allow optional country code
const phoneRegex = /^([+][0-9]{1,3}\s?)?([0-9]{9})$/
const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
  telefono: z.string().regex(phoneRegex, 'El teléfono debe tener 9 dígitos (ej: 612345678) o incluir el código de país (ej: +34 612345678)'),
  email: z.string().email('El email no es válido'),
  residencia: z.string().min(1, 'La residencia es obligatoria'),
  comoConociste: z.string().min(1, 'Este campo es obligatorio'),
  operacionInteres: z.string().min(1, 'Selecciona una operación'),
  numeroTitulares: z.string().min(1, 'Selecciona el número de titulares'),
  estadoActual: z.string().min(1, 'Selecciona el estado actual'),
  bancosOperas: z.string().optional(),
  preguntadoOtroBroker: z.string().min(1, 'Selecciona una opción'),
  viviendaLibreCargas: z.string().min(1, 'Selecciona una opción'),
  preguntadoBanco: z.string().min(1, 'Selecciona una opción'),
  situacionLaboral: z.string().min(1, 'Selecciona tu situación laboral'),
  tieneDeudas: z.string().min(1, 'Selecciona una opción'),
  explicacionDeuda: z.string().optional(),
  horarioContacto: z.array(z.string()).min(1, 'Selecciona al menos un horario'),
  observaciones: z.string().optional(),
})

export default function MortgageForm() {
  const [currentScreen, setCurrentScreen] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    residencia: '',
    comoConociste: '',
    operacionInteres: '',
    numeroTitulares: '',
    estadoActual: '',
    bancosOperas: '',
    preguntadoOtroBroker: '',
    viviendaLibreCargas: '',
    preguntadoBanco: '',
    situacionLaboral: '',
    tieneDeudas: '',
    explicacionDeuda: '',
    horarioContacto: [],
    observaciones: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextScreen = () => {
    // Validate only the fields for the current screen
    let fieldsToValidate: (keyof FormData)[] = []
    if (currentScreen === 1) {
      fieldsToValidate = ['nombre', 'apellidos', 'telefono', 'email', 'residencia', 'comoConociste']
    } else if (currentScreen === 2) {
      fieldsToValidate = ['operacionInteres', 'numeroTitulares']
    } else if (currentScreen === 3) {
      fieldsToValidate = ['estadoActual', 'preguntadoOtroBroker', 'viviendaLibreCargas', 'preguntadoBanco']
    } else if (currentScreen === 4) {
      fieldsToValidate = ['situacionLaboral', 'tieneDeudas']
      if (formData.tieneDeudas === 'si') fieldsToValidate.push('explicacionDeuda')
    } else if (currentScreen === 5) {
      fieldsToValidate = ['horarioContacto']
    }
    const fieldSelectors = fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<keyof typeof formSchema.shape, true>);

    const partialSchema = formSchema.pick(fieldSelectors);
    const result = partialSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {}
      result.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      // Optionally scroll to first error
      const firstErrorField = Object.keys(fieldErrors)[0]
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    } else {
      setErrors({})
      return true
    }
  }

  const nextScreen = () => {
    if (currentScreen < 5) {
      if (handleNextScreen()) {
        setCurrentScreen(prev => prev + 1)
      }
    }
  }

  const prevScreen = () => {
    if (currentScreen > 1) {
      setCurrentScreen(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    // Validate all fields before submit
    const result = formSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {}
      result.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message
      })
      setErrors(fieldErrors)
      // Optionally scroll to first error
      const firstErrorField = Object.keys(fieldErrors)[0]
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    } else {
      setErrors({})
    }

    // Generate email body 
    const emailBody = `
      Nombre: ${formData.nombre} ${formData.apellidos}
      Teléfono: ${formData.telefono}
      Email: ${formData.email}
      Residencia: ${formData.residencia}
      Cómo nos conociste: ${formData.comoConociste}

      Operación de interés: ${formData.operacionInteres}
      Número de titulares: ${formData.numeroTitulares}

      Estado actual: ${formData.estadoActual}
      Bancos con los que operas: ${formData.bancosOperas}
      Has preguntado a otro broker: ${formData.preguntadoOtroBroker}
      Vivienda libre de cargas: ${formData.viviendaLibreCargas}
      Has preguntado en algún banco: ${formData.preguntadoBanco}

      Situación laboral: ${formData.situacionLaboral}
      Tiene deudas: ${formData.tieneDeudas}
      Explicación de deuda: ${formData.explicacionDeuda || 'No aplica'}

      Horario de contacto preferido: ${formData.horarioContacto.join(', ')}
      Observaciones: ${formData.observaciones || 'Ninguna'}
    `
    // Convert email body to HTML format
    const emailBodyHtml = emailBody.replace(/\n/g, '<br>')

    const formDataEmail = {
      to: 'sergiomadrigal@gmail.com',
      subject: 'Nuevo formulario de hipotecas',
      html: emailBodyHtml
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataEmail),
      })

      if (response.ok) {
        alert('Formulario enviado correctamente')
        // Reset form or redirect
      } else {
        alert('Error al enviar el formulario')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el formulario')
    }
  }

  const steps = [
    { number: 1, title: 'Datos de contacto', icon: User, completed: currentScreen > 1 },
    { number: 2, title: 'Tipo de operación', icon: Home, completed: currentScreen > 2 },
    { number: 3, title: 'Situación actual', icon: MapPin, completed: currentScreen > 3 },
    { number: 4, title: 'Información laboral', icon: Briefcase, completed: currentScreen > 4 },
    { number: 5, title: 'Disponibilidad', icon: Clock, completed: currentScreen > 5 }
  ]

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 1: return <Screen1 formData={formData} updateFormData={updateFormData} errors={errors} />
      case 2: return <Screen2 formData={formData} updateFormData={updateFormData} errors={errors} />
      case 3: return <Screen3 formData={formData} updateFormData={updateFormData} errors={errors} />
      case 4: return <Screen4 formData={formData} updateFormData={updateFormData} errors={errors} />
      case 5: return <Screen5 formData={formData} updateFormData={updateFormData} errors={errors} />
      default: return <Screen1 formData={formData} updateFormData={updateFormData} errors={errors} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header with steps - Desktop only */}
      <div className="hidden lg:block border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentScreen === step.number
              const isCompleted = step.completed

              return (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${isActive
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-6 transition-colors duration-200 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-screen py-8 px-4">
        <div className="w-full max-w-2xl">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              {/* Mobile progress */}
              <div className="lg:hidden mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-blue-600">
                    Paso {currentScreen} de 5
                  </span>
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round((currentScreen / 5) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentScreen / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Mobile header */}
              <div className="lg:hidden text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  Información para comenzar
                </h1>
                <p className="text-gray-600">
                  Si estás buscando un acompañamiento sólido y directo, estás en el lugar correcto.
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-6 lg:px-8">
              <div className="space-y-8">
                {renderCurrentScreen()}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={prevScreen}
                    disabled={currentScreen === 1}
                    className="px-6 py-3 h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>

                  {currentScreen === 5 ? (
                    <Button
                      onClick={handleSubmit}
                      className="px-8 py-3 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Enviar formulario
                    </Button>
                  ) : (
                    <Button
                      onClick={nextScreen}
                      className="px-8 py-3 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                    >
                      Siguiente paso
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}