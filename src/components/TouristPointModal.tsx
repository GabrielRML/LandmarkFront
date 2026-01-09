import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { getStates, getCities } from '../services/ibge.service'
import type { ITouristPoint } from '../types/tourist-point.interface'
import type { IEstado, IMunicipio } from '../types/IBGE.interface'

interface TouristPointModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<ITouristPoint, 'id'>, id?: string) => Promise<void>
  editingPoint?: ITouristPoint | null
}

export default function TouristPointModal({ isOpen, onClose, onSubmit, editingPoint }: TouristPointModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    ibgeCode: '',
    cityName: '',
    stateName: '',
    stateAcronym: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [states, setStates] = useState<IEstado[]>([])
  const [cities, setCities] = useState<IMunicipio[]>([])
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null)
  const [isLoadingStates, setIsLoadingStates] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadStates()
      if (editingPoint) {
        setFormData({
          name: editingPoint.name,
          description: editingPoint.description,
          location: editingPoint.location,
          ibgeCode: editingPoint.ibgeCode,
          cityName: editingPoint.cityName,
          stateName: editingPoint.stateName,
          stateAcronym: editingPoint.stateAcronym
        })
        const state = states.find(e => e.sigla === editingPoint.stateAcronym)
        if (state) {
          setSelectedStateId(state.id)
        }
      }
    }
  }, [isOpen, editingPoint])

  useEffect(() => {
    if (selectedStateId) {
      loadCities(selectedStateId)
    } else {
      setCities([])
      setFormData(prev => ({ ...prev, cityName: '', ibgeCode: '' }))
    }
  }, [selectedStateId])

  const loadStates = async () => {
    setIsLoadingStates(true)
    try {
      const response = await getStates()
      setStates(response.data)
    } catch (error) {
      console.error('Erro ao carregar estados:', error)
    } finally {
      setIsLoadingStates(false)
    }
  }

  const loadCities = async (estadoId: number) => {
    setIsLoadingCities(true)
    try {
      const response = await getCities(estadoId)
      setCities(response.data)
    } catch (error) {
      console.error('Erro ao carregar cidades:', error)
    } finally {
      setIsLoadingCities(false)
    }
  }

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = Number(e.target.value)
    setSelectedStateId(stateId || null)
    
    if (stateId) {
      const state = states.find(est => est.id === stateId)
      if (state) {
        setFormData(prev => ({
          ...prev,
          stateName: state.nome,
          stateAcronym: state.sigla,
          cityName: '',
          ibgeCode: ''
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        stateName: '',
        stateAcronym: '',
        cityName: '',
        ibgeCode: ''
      }))
    }

    if (errors.stateName) {
      setErrors(prev => ({ ...prev, stateName: '' }))
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = Number(e.target.value)
    
    if (cityId) {
      const city = cities.find(cid => cid.id === cityId)
      if (city) {
        setFormData(prev => ({
          ...prev,
          cityName: city.nome,
          ibgeCode: city.id.toString()
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        cityName: '',
        ibgeCode: ''
      }))
    }

    if (errors.cityName) {
      setErrors(prev => ({ ...prev, cityName: '' }))
    }
  }

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório'
    } else if (formData.name.length > 200) {
      newErrors.name = 'O nome deve ter no máximo 200 caracteres'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'A descrição é obrigatória'
    } else if (formData.description.length > 100) {
      newErrors.description = 'A descrição deve ter no máximo 100 caracteres'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'A localização é obrigatória'
    }

    if (!formData.ibgeCode.trim()) {
      newErrors.ibgeCode = 'O código IBGE é obrigatório'
    }

    if (!formData.cityName.trim()) {
      newErrors.cityName = 'O nome da cidade é obrigatório'
    }

    if (!formData.stateName.trim()) {
      newErrors.stateName = 'O nome do estado é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData, editingPoint?.id)
      setFormData({
        name: '',
        description: '',
        location: '',
        ibgeCode: '',
        cityName: '',
        stateName: '',
        stateAcronym: ''
      })
      setErrors({})
      setSelectedStateId(null)
      setCities([])
      onClose()
      
      Swal.fire({
        title: editingPoint ? 'Atualizado!' : 'Cadastrado!',
        text: editingPoint ? 'Ponto turístico atualizado com sucesso.' : 'Ponto turístico cadastrado com sucesso.',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Erro ao salvar:', error)
      Swal.fire({
        title: 'Erro!',
        text: 'Erro ao salvar ponto turístico.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      ibgeCode: '',
      cityName: '',
      stateName: '',
      stateAcronym: ''
    })
    setErrors({})
    setSelectedStateId(null)
    setCities([])
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{editingPoint ? 'Editar Ponto Turístico' : 'Cadastrar Ponto Turístico'}</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Nome *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={200}
                className={`w-full px-4 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: Cristo Redentor"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Descrição *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={100}
                rows={3}
                className={`w-full px-4 py-2 bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Breve descrição do ponto turístico"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                Localização *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border ${errors.location ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: Morro do Corcovado"
              />
              {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-300 mb-1">
                        Estado *
                    </label>
                    <select
                        id="estado"
                        name="estado"
                        value={selectedStateId || ''}
                        onChange={handleStateChange}
                        disabled={isLoadingStates}
                        className={`w-full px-4 py-2 bg-gray-700 border ${errors.stateName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <option value="">
                            {isLoadingStates ? 'Carregando estados...' : 'Selecione um estado'}
                        </option>
                        {states.map(state => (
                            <option key={state.id} value={state.id}>
                                {state.nome} - {state.sigla}
                            </option>
                        ))}
                    </select>
                    {errors.stateName && <p className="mt-1 text-sm text-red-500">{errors.stateName}</p>}
                </div>

                <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-300 mb-1">
                        Cidade *
                    </label>
                    <select
                        id="cidade"
                        name="city"
                        value={formData.ibgeCode}
                        onChange={handleCityChange}
                        disabled={!selectedStateId || isLoadingCities}
                        className={`w-full px-4 py-2 bg-gray-700 border ${errors.cityName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <option value="">
                            {!selectedStateId 
                                ? 'Selecione um estado primeiro' 
                                : isLoadingCities 
                                ? 'Carregando cidades...' 
                                : 'Selecione uma cidade'}
                        </option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>
                                {city.nome}
                            </option>
                        ))}
                    </select>
                    {errors.cityName && <p className="mt-1 text-sm text-red-500">{errors.cityName}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : editingPoint ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
