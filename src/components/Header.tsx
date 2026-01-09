interface HeaderProps {
  onRegisterClick: () => void
}

export default function Header({ onRegisterClick }: HeaderProps) {
  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Placeholder */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Pontos Turísticos</h1>
          </div>
          
          {/* Botão Cadastrar */}
          <button
            onClick={onRegisterClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            + Cadastrar Ponto
          </button>
        </div>
      </div>
    </header>
  )
}
