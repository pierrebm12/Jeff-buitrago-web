import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export function Biography() {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-24 bg-[#0a0a0a]" id="biografia">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-lg overflow-hidden border border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <img 
                src="https://res.cloudinary.com/dt4mproy3/image/upload/v1771908086/e5863a23-8d4b-469f-8d96-a39adbb299e9_e9zzzb.jpg" 
                alt="Jeff Buitrago" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 border-b-2 border-primary/30 pb-4 inline-block">
              {t.biography.title}
            </h2>
            
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">
              <p>{t.biography.text1}</p>
              <p>{t.biography.text2}</p>
              <p className="text-white font-medium border-l-4 border-primary pl-4 italic">
                {t.biography.text3}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
