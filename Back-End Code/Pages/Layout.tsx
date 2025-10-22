import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Palette, Grid3x3, Info } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <style>{`
        :root {
          --primary-50: #fef3f2;
          --primary-100: #fee4e2;
          --primary-200: #fecdca;
          --primary-300: #fda29b;
          --primary-400: #f97066;
          --primary-500: #f04438;
          --primary-600: #d92d20;
          --primary-700: #b42318;
          --primary-800: #912018;
          --primary-900: #7a271a;
        }
      `}</style>

      {/* Floating Navigation */}
      <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled ? 'w-11/12 max-w-6xl' : 'w-11/12 max-w-7xl'
      }`}>
        <nav className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 transition-all duration-300 ${
          scrolled ? 'py-3 px-6' : 'py-4 px-8'
        }`}>
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Gallery")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                  FGCU Artverse
                </h1>
                <p className="text-xs text-gray-500">Discover Digital Art</p>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <Link to={createPageUrl("Gallery")}>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  location.pathname === createPageUrl("Gallery")
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <Grid3x3 className="w-4 h-4" />
                  <span>Gallery</span>
                </button>
              </Link>
              <Link to={createPageUrl("About")}>
                <button className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  location.pathname === createPageUrl("About")
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-28">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 bg-white/40 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-orange-500" />
            <span className="text-gray-800">FGCU Artverse</span>
          </div>
          <p className="text-sm text-gray-600">
            Powered by FGCU Dataverse • Celebrating Digital Art & Creativity
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2025 Florida Gulf Coast University
          </p>
        </div>
      </footer>
    </div>
  );
}
