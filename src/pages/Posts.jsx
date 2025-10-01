import { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Feed } from "../components/posts/Feed.jsx";

function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch {
    return null;
  }
}

function Posts() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = useMemo(() => [
    { key: 'all', label: 'Todas'},
    { key: 'recent', label: 'Recientes'},
    { key: 'popular', label: 'Populares'}  
  ], []);

  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);
  }, []);

  const handleFilterSelect = useCallback((filterKey) => {
    setSelectedFilter(filterKey);
  }, []);

  const activeFilter = useMemo(() => 
    filters.find(f => f.key === selectedFilter)
  , [filters, selectedFilter]);

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-6 max-w-md w-full">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-secondary">Inicia sesión para continuar</h2>
              <p className="text-gray-400">Necesitas estar autenticado para ver y crear publicaciones en la comunidad.</p>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-8">

          <div className="space-y-4">
            <h1 className="flex items-center gap-3 text-2xl font-bold text-secondary">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a3 3 0 01-3-3V9a2 2 0 012-2h2M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Comunidad
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Comparte tus entrenamientos, descubre nuevas rutinas e interactúa con otros miembros de la comunidad.
            </p>
          </div>

          <div className="bg-tertiary/30 rounded-xl p-4 sm:p-6 border border-tertiary/50 space-y-3">
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterSelect(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-200
                    ${selectedFilter === filter.key
                      ? 'bg-primary text-background'
                      : 'bg-tertiary/60 text-gray-400 hover:bg-tertiary hover:text-secondary'
                    }`}
                >
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-tertiary/30 text-xs text-gray-500 flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Mostrando: <span className="text-secondary font-medium">{activeFilter?.label}</span>
            </div>
          </div>

          <div className="w-full">
            <Feed
              currentUserId={currentUserId}
              showCreateButton={true}
              layout="default"
              filter={selectedFilter}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export { Posts };