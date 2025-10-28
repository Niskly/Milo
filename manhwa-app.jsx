import React, { useState, useEffect, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home,
  Library,
  BookOpen,
  Search,
  Menu,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// --- Global Config ---
// This is where you will add your Firebase config later
const firebaseConfig = {
  // Your config keys will go here
};
// This global ID is provided by the environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- API Fetching Hook ---
// A custom hook to make fetching data from our API easier
// It handles loading, error, and data states for us
function useApi(apiPath) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Abort controller to prevent memory leaks on unmount
    const abortController = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(apiPath, { signal: abortController.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Fetch error:", err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, [apiPath]); // Re-run effect if the API path changes

  return { data, isLoading, error };
}

// --- Routing Context ---
// This creates a simple "router" so we can change pages.
// We pass `setPage` and `setSeriesId` down to all components.
const RouterContext = createContext();

// --- 1. NavBar Component ---
// This is the navigation bar you asked for
function NavBar({ setPage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setPage: navigate } = useContext(RouterContext);

  const navItems = [
    { name: 'Home', icon: Home, page: 'home' },
    { name: 'Library', icon: Library, page: 'library' },
  ];

  const handleNav = (page) => {
    navigate(page);
    setIsMobileMenuOpen(false); // Close menu on navigation
  };

  return (
    <>
      {/* --- Mobile Bottom Nav --- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-700 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.page)}
              className="flex flex-col items-center justify-center text-neutral-400 hover:text-white transition-colors px-4 py-2"
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* --- Desktop Side Nav --- */}
      <nav className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:z-50 bg-neutral-900 border-r border-neutral-700">
        <div className="flex items-center h-20 px-6 border-b border-neutral-700">
          <BookOpen size={32} className="text-blue-500" />
          <span className="ml-3 text-2xl font-bold text-white">Manhwa</span>
        </div>
        <div className="flex-1 overflow-y-auto mt-6">
          <div className="px-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNav(item.page)}
                className="w-full flex items-center px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              >
                <item.icon size={20} />
                <span className="ml-4 text-lg font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-neutral-700">
          <p className="text-xs text-neutral-500">
            For personal use only.
          </p>
        </div>
      </nav>

      {/* --- Mobile Top Bar --- */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-neutral-900/80 backdrop-blur-sm h-16 flex items-center justify-between px-4 border-b border-neutral-700">
        <div className="flex items-center">
          <BookOpen size={24} className="text-blue-500" />
          <span className="ml-2 text-xl font-bold text-white">Manhwa</span>
        </div>
        <button className="text-neutral-300 hover:text-white">
          <Search size={24} />
        </button>
      </header>
    </>
  );
}

// --- 2. HomePage Component ---
function HomePage() {
  const { setPage, setSeriesId } = useContext(RouterContext);
  
  // Fetch *all* series data from our API
  const { data, isLoading, error } = useApi('/api/get-series');

  const openSeries = (id) => {
    setSeriesId(id);
    setPage('series');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">New Chapters</h1>
      
      {isLoading && <LoadingSpinner />}
      
      {error && <ErrorMessage message={error?.message || 'Failed to load data'} />}

      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.series.map((series) => (
            <SeriesCard key={series.id} series={series} onClick={() => openSeries(series.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- 3. LibraryPage Component ---
function LibraryPage() {
  const { setPage, setSeriesId } = useContext(RouterContext);
  
  // Fetch *all* series data from our API
  // In a real app, this might fetch from a "favorites" list,
  // but for now, it's the same as the homepage.
  const { data, isLoading, error } = useApi('/api/get-series');

  const openSeries = (id) => {
    setSeriesId(id);
    setPage('series');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">My Library</h1>
      
      {isLoading && <LoadingSpinner />}
      
      {error && <ErrorMessage message={error?.message || 'Failed to load data'} />}
      
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.series.map((series) => (
            <SeriesCard key={series.id} series={series} onClick={() => openSeries(series.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- 4. SeriesPage Component ---
// Shows the cover, description, and chapter list for ONE series
function SeriesPage({ seriesId }) {
  const { setPage, setChapterNumber } = useContext(RouterContext);

  // Fetch data for *only this* series
  const { data, isLoading, error } = useApi(`/api/get-series?id=${seriesId}`);

  const openChapter = (chapterNum) => {
    setChapterNumber(chapterNum);
    setPage('chapter');
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error?.message || 'Failed to load series'} />;
  if (!data) return null; // No data yet

  const series = data.series; // Our API returns { series: {...} }

  return (
    <div>
      {/* --- Header / Cover --- */}
      <div className="relative h-[400px]">
        {/* Cover Image */}
        <img 
          src={series.coverUrl} 
          alt={series.title} 
          className="w-full h-full object-cover" 
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
        {/* Back Button */}
        <button 
          onClick={() => setPage('home')}
          className="absolute top-16 md:top-4 left-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        {/* Title */}
        <h1 className="absolute bottom-4 left-4 z-10 text-3xl md:text-5xl font-extrabold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {series.title}
        </h1>
      </div>

      {/* --- Info & Chapters --- */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Chapters</h2>
        <div className="flex flex-col-reverse space-y-2 space-y-reverse">
          {series.chapters.map((chapter) => (
            <button
              key={chapter.number}
              onClick={() => openChapter(chapter.number)}
              className="w-full text-left p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              <span className="text-lg text-neutral-100">Chapter {chapter.number}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 5. ChapterPage Component ---
// Shows the actual manga/manhwa images
function ChapterPage({ seriesId, chapterNumber }) {
  const { setPage, setChapterNumber } = useContext(RouterContext);
  
  // Fetch data for *only this* series
  const { data, isLoading, error } = useApi(`/api/get-series?id=${seriesId}`);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error?.message || 'Failed to load chapter'} />;
  if (!data) return null; // No data yet

  // Find the specific chapter we're on
  const chapter = data.series.chapters.find(c => c.number == chapterNumber);
  const totalChapters = data.series.chapters.length;

  if (!chapter) {
    return (
      <ErrorMessage message="Chapter not found.">
        <button onClick={() => setPage('series')} className="mt-4 px-4 py-2 bg-blue-500 rounded-lg">
          Back to Series
        </button>
      </ErrorMessage>
    );
  }

  const goToChapter = (num) => {
    if (num > 0 && num <= totalChapters) {
      setChapterNumber(num);
      window.scrollTo(0, 0); // Scroll to top on new chapter
    }
  };
  
  const prevChapter = () => goToChapter(chapterNumber - 1);
  const nextChapter = () => goToChapter(chapterNumber + 1);

  return (
    <div className="bg-black min-h-screen">
      {/* --- Chapter Navigation --- */}
      <div className="sticky top-0 z-50 flex items-center justify-between h-16 bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700 px-2 md:px-4">
        <button 
          onClick={() => setPage('series')}
          className="p-2 rounded-full text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex-1 text-center truncate px-2">
          <span className="text-lg font-medium text-white">
            Chapter {chapter.number}
          </span>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={prevChapter}
            disabled={chapterNumber <= 1}
            className="p-2 rounded-full text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:text-neutral-600 disabled:bg-transparent"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextChapter}
            disabled={chapterNumber >= totalChapters}
            className="p-2 rounded-full text-neutral-300 hover:bg-neutral-800 hover:text-white disabled:text-neutral-600 disabled:bg-transparent"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* --- Chapter Images --- */}
      <div className="flex flex-col items-center">
        {chapter.pages.map((pageUrl, index) => (
          <img
            key={index}
            src={pageUrl}
            alt={`Page ${index + 1}`}
            className="w-full max-w-3xl"
            onError={(e) => { 
              // Fallback for broken images
              e.target.onerror = null; 
              e.target.src="https://placehold.co/800x1200/111111/444444?text=Image+Failed+to+Load";
            }}
          />
        ))}
      </div>
      
      {/* --- Bottom Navigation --- */}
      <div className="flex justify-between items-center p-4 md:p-8">
        <button
          onClick={prevChapter}
          disabled={chapterNumber <= 1}
          className="px-4 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          Prev Chapter
        </button>
        <button
          onClick={nextChapter}
          disabled={chapterNumber >= totalChapters}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Next Chapter
        </button>
      </div>
    </div>
  );
}

// --- Utility Components ---

function SeriesCard({ series, onClick }) {
  return (
    <div 
      className="rounded-lg overflow-hidden bg-neutral-800 shadow-lg cursor-pointer transform transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      <img 
        src={series.coverUrl} 
        alt={series.title} 
        className="w-full h-48 sm:h-64 md:h-72 object-cover" 
        onError={(e) => { 
          // Fallback for broken images
          e.target.onerror = null; 
          e.target.src="https://placehold.co/400x600/111111/444444?text=No+Cover";
        }}
      />
      <div className="p-3">
        <h3 className="text-md font-semibold text-white truncate" title={series.title}>
          {series.title}
        </h3>
        <p className="text-sm text-neutral-400 mt-1">
          {/* This is just an example, our mock data doesn't have this */}
          {series.latestChapter || `Chapter ${series.chapters.length}`}
        </p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function ErrorMessage({ message, children }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
      <p className="text-neutral-300">{message}</p>
      {children}
    </div>
  );
}

// --- Main App Component ---
// This is the root of our app
function App() {
  const [page, setPage] = useState('home'); // 'home', 'library', 'series', 'chapter'
  const [currentSeriesId, setSeriesId] = useState(null);
  const [currentChapterNumber, setChapterNumber] = useState(null);

  // This is the "Context" that we pass down.
  // It allows any component (like NavBar) to change the page.
  const routerContextValue = {
    page,
    setPage,
    currentSeriesId,
    setSeriesId,
    currentChapterNumber,
    setChapterNumber,
  };

  // Simple router logic
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage />;
      case 'library':
        return <LibraryPage />;
      case 'series':
        return <SeriesPage seriesId={currentSeriesId} />;
      case 'chapter':
        return <ChapterPage seriesId={currentSeriesId} chapterNumber={currentChapterNumber} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <RouterContext.Provider value={routerContextValue}>
      <div className="min-h-screen bg-neutral-900 text-neutral-100">
        <NavBar />
        
        {/* Main content area */}
        {/* We add padding to account for the navbars */}
        {/* `pt-16` for mobile top bar */}
        {/* `pb-16` for mobile bottom bar */}
        {/* `md:pl-64` for desktop side bar */}
        <main className="pt-16 pb-16 md:pt-0 md:pb-0 md:pl-64">
          {renderPage()}
        </main>
      </div>
    </RouterContext.Provider>
  );
}

// --- Mount the App ---
// This is the standard React way to start the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

