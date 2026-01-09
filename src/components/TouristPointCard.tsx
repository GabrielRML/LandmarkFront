import type { ITouristPoint } from "../types/tourist-point.interface"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faLocationDot, faCalendar } from '@fortawesome/free-solid-svg-icons'

interface TouristPointCardProps {
  point: ITouristPoint
  onEdit?: (point: ITouristPoint) => void
  onDelete?: (point: ITouristPoint) => void
}

export default function TouristPointCard({ point, onEdit, onDelete }: TouristPointCardProps) {
  const formatDate = (dateString: string) => {
    const isoString = dateString.endsWith('Z') ? dateString : dateString + 'Z'
    const date = new Date(isoString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all hover:shadow-xl relative">
      <div className="absolute top-4 right-4 flex gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(point)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-700 rounded-lg transition-all"
            title="Editar"
          >
            <FontAwesomeIcon icon={faPencil} className="w-5 h-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(point)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-lg transition-all"
            title="Deletar"
          >
            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
          </button>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 pr-8">{point.name}</h3>
      <p className="text-gray-300 mb-4 line-clamp-3">{point.description}</p>
      <div className="flex items-center gap-4 flex-wrap text-sm text-gray-400">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4 mr-2" />
          <span>{point.cityName}, {point.stateAcronym}</span>
        </div>
        {point.createdAt && (
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 mr-2" />
            <span>{formatDate(point.createdAt)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
