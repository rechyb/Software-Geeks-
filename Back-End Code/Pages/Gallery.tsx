import React, { useState, useEffect } from "react";
import { fetchArtworkDatasets, searchArtworks, type Artwork } from "../api/dataverseClient";
import { Search, Loader2, Image as ImageIcon, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { motion, AnimatePresence } from "motion/react";
import ArtworkCard from "../components/gallery/ArtworkCard";
import ArtworkModal from "../components/gallery/ArtworkModal";

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    loadArtworks();
  }, []);

  useEffect(() => {
    const filtered = searchArtworks(artworks, searchQuery);
    setFilteredArtworks(filtered);
  }, [searchQuery, artworks]);

  const loadArtworks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchArtworkDatasets();
      
      if (data.length > 0) {
        setArtworks(data);
        setFilteredArtworks(data);
      } else {
        setError("No artworks found in the FGCU Dataverse 'art' collection. The collection may be empty or datasets may not have accessible metadata.");
      }
    } catch (err) {
      console.error("Error loading artworks:", err);
      setError(
        err instanceof Error 
          ? `Failed to connect to FGCU Dataverse: ${err.message}` 
          : "Unable to connect to FGCU Dataverse API. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-rose-400/20 to-purple-400/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
              Art Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Explore the vibrant world of digital art from FGCU Dataverse
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, artist, or medium..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-2xl border-2 border-white/50 bg-white/80 backdrop-blur-sm focus:border-orange-400 focus:ring-orange-400 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Connecting to FGCU Dataverse...</p>
            <p className="text-gray-500 text-sm mt-2">Fetching artwork metadata</p>
          </div>
        ) : error ? (
          <div className="max-w-3xl mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
            <div className="text-center">
              <Button 
                onClick={loadArtworks}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            </div>
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-gray-700 mb-2">No artworks found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search terms" : "The gallery is currently empty"}
            </p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-center"
            >
              <p className="text-gray-600">
                Showing <span className="text-orange-600">{filteredArtworks.length}</span> {filteredArtworks.length === 1 ? 'artwork' : 'artworks'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {filteredArtworks.map((artwork, index) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    index={index}
                    onClick={() => setSelectedArtwork(artwork)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Artwork Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </div>
  );
}
