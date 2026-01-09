interface PaginationProps {
  currentPage: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>
      
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Próxima
      </button>
    </div>
  )
}
