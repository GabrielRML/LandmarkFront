import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import TouristPointCard from './components/TouristPointCard'
import Pagination from './components/Pagination'
import TouristPointModal from './components/TouristPointModal'
import { touristPointService } from './services/tourist-point.service'
import type { IPagedResult } from './types/paged-result.interface'
import type { ITouristPoint } from './types/tourist-point.interface'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<IPagedResult<ITouristPoint>>({
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPoint, setEditingPoint] = useState<ITouristPoint | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const fetchTouristPoints = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await touristPointService.getTouristPoints({
          pageNumber: currentPage,
          pageSize: 10,
          name: debouncedSearchTerm || undefined
        })
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar pontos turísticos')
        console.error('Erro ao buscar pontos turísticos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTouristPoints()
  }, [currentPage, debouncedSearchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleRegisterClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPoint(null)
  }

  const handleSubmitTouristPoint = async (data: Omit<ITouristPoint, 'id'>, id?: string) => {
    try {
      if (id) {
        await touristPointService.updateTouristPoint(id, data)
      } else {
        await touristPointService.createTouristPoint(data)
      }
      setIsModalOpen(false)
      setEditingPoint(null)
      const result = await touristPointService.getTouristPoints({
        pageNumber: currentPage,
        pageSize: 10,
        name: debouncedSearchTerm || undefined
      })
      setData(result)
    } catch (err) {
      console.error('Erro ao salvar ponto turístico:', err)
      throw err
    }
  }

  const handleEditClick = (point: ITouristPoint) => {
    setEditingPoint(point)
    setIsModalOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onRegisterClick={handleRegisterClick} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar value={searchTerm} onChange={handleSearch} />
        </div>

        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">Carregando...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-8">
              {data.items.length > 0 ? (
                data.items.map((point) => (
                  <TouristPointCard key={point.id} point={point} onEdit={handleEditClick} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">Nenhum ponto turístico encontrado</p>
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages}
              hasPreviousPage={data.hasPreviousPage}
              hasNextPage={data.hasNextPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <TouristPointModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTouristPoint}
        editingPoint={editingPoint}
      />
    </div>
  )
}

export default App
