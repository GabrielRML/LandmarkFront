import type { ITouristPoint } from "../types/tourist-point.interface"

interface TouristPointCardProps {
  point: ITouristPoint
  onEdit?: (point: ITouristPoint) => void
}

export default function TouristPointCard({ point, onEdit }: TouristPointCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all hover:shadow-xl relative">
      {onEdit && (
        <button
          onClick={() => onEdit(point)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-700 rounded-lg transition-all"
          title="Editar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      <h3 className="text-xl font-bold text-white mb-2 pr-8">{point.name}</h3>
      <p className="text-gray-300 mb-4 line-clamp-3">{point.description}</p>
      <div className="flex items-center text-sm text-gray-400">
        <svg
          className="h-4 w-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span>{point.cityName}, {point.stateAcronym}</span>
      </div>
    </div>
  )
}
