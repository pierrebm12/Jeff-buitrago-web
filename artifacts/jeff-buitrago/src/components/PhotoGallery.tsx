import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useListPhotos } from "@workspace/api-client-react";

const fallbackImages = [
  {
    url: "https://res.cloudinary.com/dt4mproy3/image/upload/v1771907883/32f33fb4-3a7e-4668-a9ab-830259d3d60b_h65xru.jpg",
    title: "Evento Privado",
    titleEn: "Private Event",
  },
  {
    url: "https://res.cloudinary.com/dt4mproy3/image/upload/v1771908086/b63b7ea7-211b-4f17-9872-2562e1f0941a_j1ohwv.jpg",
    title: "Evento Corporativo",
    titleEn: "Corporate Event",
  },
  {
    url: "https://res.cloudinary.com/dt4mproy3/image/upload/v1771908085/73f2e20c-ebe8-4384-923e-002e15f80938_bnyxix.jpg",
    title: "Yo Me Llamo Colombia",
    titleEn: "Yo Me Llamo Colombia",
  },
];

export function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { t, language } = useLanguage();
  const { data: apiPhotos = [] } = useListPhotos();
  const touchStartX = useRef<number>(0);

  const images = apiPhotos.length > 0 ? apiPhotos : fallbackImages;

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + images.length) % images.length);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [images.length, currentIndex]);

  useEffect(() => {
    if (currentIndex >= images.length) setCurrentIndex(0);
  }, [images.length]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) paginate(diff > 0 ? 1 : -1);
  };

  if (images.length === 0) return null;

  const current = images[currentIndex] as any;
  const displayTitle =
    language === "en" && current.titleEn ? current.titleEn : current.title;

  return (
    <section className="py-12 md:py-24 bg-black overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white border-b-2 border-primary/30 pb-3 md:pb-4 inline-block">
            {t.gallery.title}{" "}
            <span className="text-primary">{t.gallery.photos}</span>
          </h2>
        </div>

        {/* Portrait slider — taller than wide (4:5) */}
        <div
          className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)] border border-white/5 select-none aspect-[4/5]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={current.url}
                alt={displayTitle}
                draggable={false}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 md:p-10 w-full">
                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-xl sm:text-2xl md:text-4xl font-bold text-white drop-shadow-lg"
                >
                  {displayTitle}
                </motion.h3>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators only */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`rounded-full transition-all duration-300 h-2 ${
                    i === currentIndex
                      ? "bg-primary w-6"
                      : "bg-white/40 w-2 hover:bg-white/70"
                  }`}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
