import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export function ContactForm() {
  const { t, language } = useLanguage();
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("Privado");
  const [message, setMessage] = useState("");
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    const text = language === "es"
      ? encodeURIComponent(`Hola, mi nombre es ${name}. Quiero información para un evento tipo ${eventType}. Detalles: ${message}`)
      : encodeURIComponent(`Hello, my name is ${name}. I'd like information for a ${eventType} event. Details: ${message}`);
    window.open(`https://wa.me/573215487551?text=${text}`, "_blank");
  };

  const confirmBudget = () => {
    const text = language === "es"
      ? encodeURIComponent("Hola, me gustaría solicitar un presupuesto para un evento.")
      : encodeURIComponent("Hello, I'd like to request a quote for an event.");
    window.open(`https://wa.me/573215487551?text=${text}`, "_blank");
    setShowBudgetModal(false);
  };

  const eventOptions = [
    { value: "Privado", label: t.contact.private },
    { value: "Corporativo", label: t.contact.corporate },
    { value: "Festival", label: t.contact.festival },
    { value: "Matrimonio", label: t.contact.wedding },
    { value: "Otro", label: t.contact.other },
  ];

  return (
    <section className="py-12 md:py-24 bg-black relative" id="contacto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-black to-black pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            {t.contact.title} <span className="text-primary">{t.contact.subtitle}</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            {language === "es"
              ? "Contáctanos para disponibilidad y contrataciones. Llevamos la mejor música en vivo a tu celebración."
              : "Contact us for availability and bookings. We bring the best live music to your celebration."}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div className="p-8 rounded-2xl bg-[#111] border border-white/5">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wider">{t.contact.directContact}</h3>
              <p className="text-primary text-2xl font-light mb-6">+57 321 548 7551</p>
              <Button
                onClick={() => setShowBudgetModal(true)}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/20 h-14 uppercase tracking-widest text-sm"
              >
                {t.contact.requestBudget}
              </Button>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-black border border-primary/20">
              <h3 className="text-lg font-bold text-primary mb-4">{t.contact.eventTypes}</h3>
              <ul className="space-y-3 text-gray-300 font-light">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" />{t.contact.private}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" />{t.contact.corporate}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" />{t.contact.festival}</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" />{t.contact.wedding}</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6 bg-[#0a0a0a] p-8 md:p-10 rounded-2xl border border-white/5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">{t.contact.nameLabel}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder={t.contact.namePlaceholder} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">{t.contact.eventTypeLabel}</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-black border-b border-white/20 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                {eventOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-widest">{t.contact.detailsLabel}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none h-32"
                placeholder={t.contact.detailsPlaceholder} required />
            </div>

            <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 h-14 text-base font-bold uppercase tracking-widest mt-4">
              {t.contact.send}
            </Button>
          </form>
        </div>
      </div>

      <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
        <DialogContent className="bg-[#111] border-primary/20 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">{t.contact.budgetTitle}</DialogTitle>
            <DialogDescription className="text-gray-400 text-base mt-4">{t.contact.budgetDesc}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setShowBudgetModal(false)} className="border-white/20 text-white hover:bg-white/10 flex-1">
              {t.contact.cancel}
            </Button>
            <Button onClick={confirmBudget} className="bg-primary text-black hover:bg-primary/90 flex-1 font-bold">
              {t.contact.goToWhatsapp}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
