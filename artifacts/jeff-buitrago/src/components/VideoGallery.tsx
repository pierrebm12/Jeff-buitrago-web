import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useListVideos } from "@workspace/api-client-react";

const fallbackVideos = [
  {
    url: "https://res.cloudinary.com/dt4mproy3/video/upload/f_mp4,vc_h264/v1771998543/AQMzb2-vpU2R5SpT7MoXMP5_mypM5Oq1lk9IeLyXFs2bxT2oTYY6mJ2a6fvUoz709YJuOKglnJzygCxcUrZbASJikNKKi7a_5kb9oYPZNQ_sq5uml",
    title: "Yo Me Llamo",
    titleEn: "Yo Me Llamo",
  },
  {
    url: "https://res.cloudinary.com/dt4mproy3/video/upload/f_mp4,vc_h264/v1771909268/AQOoXJQAIjhYujWbn5BWzSD-NR6K6avfVBp-QMnTEfa5T6dV-f7pqttS_ZVbxq2ZcjX6FInSSdvmQT936l6KUEpAOEH9L1w4HK4DsHhjIQ_qf8128",
    title: "Evento Privado",
    titleEn: "Private Event",
  },
  {
    url: "https://res.cloudinary.com/dt4mproy3/video/upload/f_mp4,vc_h264/v1771997698/AQPi0IwEPOUizVJKFQCNns3rAR5JK7EdZHt-ncETErz6bOQ4jjZvK6i7W8gb7Euo4KYhCYTW6YSo3H0Tk0g906P2vFgsZ8Pn4A1KOcE_cdo7fv",
    title: "Festival Nacional",
    titleEn: "National Festival",
  },
];

export function VideoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { t, language } = useLanguage();
  const { data: apiVideos = [] } = useListVideos();
  const touchStartX = useRef<number>(0);

  const videos = apiVideos.length > 0 ? apiVideos : fallbackVideos;

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrentIndex((prev) => (prev + dir + videos.length) % videos.length);
  };

  // Auto-advance every 8 seconds
  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setInterval(() => paginate(1), 8000);
    return () => clearInterval(timer);
  }, [videos.length, currentIndex]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35) paginate(diff > 0 ? 1 : -1);
  };

  if (videos.length === 0) return null;

  const current = videos[currentIndex] as any;
  const displayTitle =
    language === "en" && current.titleEn ? current.titleEn : current.title;
  const featuredLabel = language === "en" ? "Featured" : "Destacados";

  return (
    <section className="py-12 md:py-24 bg-[#111] overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 md:mb-12 border-b-2 border-primary/30 pb-3 md:pb-4 inline-block">
          {t.gallery.videos}{" "}
          <span className="text-primary">{featuredLabel}</span>
        </h2>

        {/* Portrait on mobile (9:16), landscape on desktop (16:9) */}
        <div
          className="relative w-full max-w-sm mx-auto md:max-w-4xl aspect-[9/16] md:aspect-[16/9] rounded-xl overflow-hidden bg-black border border-white/5 shadow-2xl select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <video
                key={current.url}
                src={current.url}
                autoPlay
                muted
                loop
                playsInline
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-0 left-0 w-full px-5 pt-4 pb-10 bg-gradient-to-b from-black/75 to-transparent pointer-events-none">
                <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white tracking-wider drop-shadow-md">
                  {displayTitle}
                </h3>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators only */}
          {videos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {videos.map((_, i) => (
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
                  aria-label={`Video ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
