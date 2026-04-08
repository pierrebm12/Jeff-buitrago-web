import { FaWhatsapp, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12 md:py-16">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="text-3xl font-bold tracking-[0.2em] text-white mb-8">
          JEFF <span className="text-primary">BUITRAGO</span>
        </div>

        <div className="flex gap-6 mb-12">
          <a href="https://wa.me/573215487551" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
            <FaWhatsapp className="w-6 h-6" />
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
            <FaYoutube className="w-6 h-6" />
          </a>
          <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all">
            <FaTiktok className="w-5 h-5" />
          </a>
        </div>

        <div className="text-gray-500 text-sm font-light tracking-wider text-center">
          &copy; {currentYear} Jeff Buitrago. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
