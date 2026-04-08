import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin } from "@/context/AdminContext";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, MapPin, Trash2, Plus, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListShows, useCreateShow, useUpdateShow, useDeleteShow,
  getListShowsQueryKey,
} from "@workspace/api-client-react";

export function Shows() {
  const { isAdmin } = useAdmin();
  const { t, language } = useLanguage();
  const qc = useQueryClient();

  const { data: shows = [], isLoading } = useListShows();
  const createShow = useCreateShow({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListShowsQueryKey() }) } });
  const updateShow = useUpdateShow({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListShowsQueryKey() }) } });
  const deleteShow = useDeleteShow({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getListShowsQueryKey() }) } });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState<any | null>(null);
  const [newDay, setNewDay] = useState("");
  const [newPlace, setNewPlace] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleAddShow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDay || !newPlace) return;
    createShow.mutate({ data: { place: newPlace, day: newDay, time: newTime || null, available: true } });
    setNewDay("");
    setNewPlace("");
    setNewTime("");
  };

  const handleReserveClick = (show: any) => {
    setSelectedShow(show);
    setShowConfirmModal(true);
  };

  const confirmReservation = () => {
    if (!selectedShow) return;
    const text = language === "es"
      ? encodeURIComponent(`Hola, quiero reservar el show del día ${selectedShow.day} en ${selectedShow.place}.`)
      : encodeURIComponent(`Hello, I'd like to reserve the show on ${selectedShow.day} in ${selectedShow.place}.`);
    window.open(`https://wa.me/573215487551?text=${text}`, "_blank");
    setShowConfirmModal(false);
    setSelectedShow(null);
  };

  return (
    <section className="py-12 md:py-24 bg-[#0a0a0a]" id="shows">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-8 md:mb-12 border-b-2 border-primary/30 pb-3 md:pb-4 inline-block">
          {t.shows.title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-primary">{t.shows.title.split(" ").at(-1)}</span>
        </h2>

        {isAdmin && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddShow}
            className="mb-12 p-6 rounded-xl bg-black/50 border border-primary/20 flex flex-col md:flex-row gap-4 items-end flex-wrap"
          >
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t.shows.dayLabel}</label>
              <input type="text" value={newDay} onChange={(e) => setNewDay(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="15 de Mayo" required />
            </div>
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t.shows.placeLabel}</label>
              <input type="text" value={newPlace} onChange={(e) => setNewPlace(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Bogotá" required />
            </div>
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t.shows.timeLabel}</label>
              <input type="text" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="8:00 PM" />
            </div>
            <Button type="submit" disabled={createShow.isPending}
              className="w-full md:w-auto h-[50px] bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-wider px-8">
              <Plus className="w-5 h-5 mr-2" /> {t.shows.addShow}
            </Button>
          </motion.form>
        )}

        {isLoading ? (
          <div className="text-gray-500 text-center py-12">Cargando...</div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {shows.map((show: any, index: number) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#111] border border-white/5 hover:border-primary/30 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 transition-all hover:bg-black"
                >
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <Calendar className="w-6 h-6 mb-1 opacity-70" />
                    <span className="text-2xl font-bold leading-none text-center px-2">{show.day}</span>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-xl tracking-wider">{show.place}</span>
                    </div>
                    {show.time && <div className="text-primary text-sm mb-2">{show.time}</div>}
                    <div className="text-sm font-light text-gray-500 uppercase tracking-widest">
                      {t.shows.liveShow}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[160px]">
                    {show.available ? (
                      <Button
                        onClick={() => handleReserveClick(show)}
                        className="w-full bg-transparent hover:bg-primary text-primary hover:text-black border border-primary rounded-full uppercase tracking-widest font-semibold transition-all h-12"
                      >
                        {t.shows.reserve}
                      </Button>
                    ) : (
                      <div className="w-full h-12 flex items-center justify-center bg-white/5 text-gray-400 rounded-full border border-white/10 uppercase tracking-widest font-semibold text-sm">
                        {t.shows.soldOut}
                      </div>
                    )}

                    {isAdmin && (
                      <div className="flex gap-2 justify-center mt-2 border-t border-white/10 pt-4">
                        <Button variant="outline" size="icon"
                          onClick={() => updateShow.mutate({ id: show.id, data: { available: !show.available } })}
                          className={`h-10 w-10 rounded-full ${show.available ? 'text-green-500 border-green-500/50 hover:bg-green-500/10' : 'text-gray-500 border-gray-500/50 hover:bg-gray-500/10'}`}
                          title={t.shows.available}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon"
                          onClick={() => deleteShow.mutate({ id: show.id })}
                          className="h-10 w-10 rounded-full text-red-500 border-red-500/50 hover:bg-red-500/10"
                          title={t.admin.delete}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {shows.length === 0 && (
              <div className="text-center py-12 text-gray-500">{t.shows.noShows}</div>
            )}
          </div>
        )}
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-[#111] border-primary/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">{t.shows.confirmTitle}</DialogTitle>
            <DialogDescription className="text-gray-400 text-lg mt-4">
              {t.shows.confirmDesc} {selectedShow?.place} {language === "es" ? "el día" : "on"} {selectedShow?.day}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="border-white/20 text-white hover:bg-white/10 flex-1">
              {t.shows.cancel}
            </Button>
            <Button onClick={confirmReservation} className="bg-primary text-black hover:bg-primary/90 flex-1 font-bold">
              {t.shows.goToWhatsapp}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
