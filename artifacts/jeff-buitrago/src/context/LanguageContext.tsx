import { createContext, useContext, useState, ReactNode } from "react";

type Language = "es" | "en";

interface Translations {
  nav: {
    home: string;
    biography: string;
    shows: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  biography: {
    title: string;
    text1: string;
    text2: string;
    text3: string;
  };
  gallery: {
    title: string;
    photos: string;
    videos: string;
  };
  shows: {
    title: string;
    reserve: string;
    soldOut: string;
    liveShow: string;
    noShows: string;
    addShow: string;
    dayLabel: string;
    placeLabel: string;
    timeLabel: string;
    confirmTitle: string;
    confirmDesc: string;
    cancel: string;
    goToWhatsapp: string;
    available: string;
    unavailable: string;
  };
  contact: {
    title: string;
    subtitle: string;
    directContact: string;
    requestBudget: string;
    eventTypes: string;
    private: string;
    corporate: string;
    festival: string;
    wedding: string;
    other: string;
    nameLabel: string;
    namePlaceholder: string;
    eventTypeLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    send: string;
    budgetTitle: string;
    budgetDesc: string;
    goToWhatsapp: string;
    cancel: string;
  };
  footer: {
    rights: string;
  };
  admin: {
    loginTitle: string;
    passwordLabel: string;
    loginButton: string;
    loginError: string;
    panel: string;
    logout: string;
    photos: string;
    videos: string;
    showsList: string;
    addPhoto: string;
    addVideo: string;
    urlLabel: string;
    titleEs: string;
    titleEn: string;
    orderLabel: string;
    add: string;
    edit: string;
    delete: string;
    toggleAvail: string;
    editShow: string;
    save: string;
    place: string;
    day: string;
    time: string;
    availableLabel: string;
    confirmDelete: string;
    confirmDeleteDesc: string;
    confirm: string;
  };
}

const translations: Record<Language, Translations> = {
  es: {
    nav: { home: "Inicio", biography: "Biografía", shows: "Shows", contact: "Contacto" },
    hero: { title: "Espectáculo Profesional", subtitle: "Música en vivo que transforma tu evento" },
    biography: {
      title: "Biografía",
      text1: "Jeff Buitrago es un cantante y compositor colombiano que ha construido su identidad artística a través de la pasión, la disciplina y una profunda conexión con la música romántica, ranchera y popular.",
      text2: "Desde temprana edad descubrió en la música una forma de expresar emociones reales y contar historias que conectan directamente con el corazón del público. Su trayectoria incluye presentaciones en eventos privados, corporativos y festivales, donde ha demostrado versatilidad, profesionalismo y entrega total en cada actuación.",
      text3: "Hoy, Jeff se posiciona como una de las voces emergentes de la música popular colombiana, con un estilo propio que mezcla tradición y modernidad.",
    },
    gallery: { title: "Galería", photos: "Fotos", videos: "Videos" },
    shows: {
      title: "Próximas Fechas",
      reserve: "Reservar",
      soldOut: "Agotado",
      liveShow: "Presentación en Vivo",
      noShows: "No hay fechas programadas por el momento.",
      addShow: "Agregar Fecha",
      dayLabel: "Día / Fecha (Ej: 15 de Mayo)",
      placeLabel: "Lugar (Ej: Bogotá)",
      timeLabel: "Hora (Ej: 8:00 PM)",
      confirmTitle: "Confirmar Reserva",
      confirmDesc: "Serás redirigido a WhatsApp para coordinar los detalles de tu reserva en",
      cancel: "Cancelar",
      goToWhatsapp: "Continuar a WhatsApp",
      available: "Disponible",
      unavailable: "No disponible",
    },
    contact: {
      title: "Haz Tu Evento",
      subtitle: "Inolvidable",
      directContact: "Contacto Directo",
      requestBudget: "Solicitar Presupuesto",
      eventTypes: "Tipos de Eventos",
      private: "Evento Privado",
      corporate: "Evento Corporativo",
      festival: "Festival / Concierto",
      wedding: "Matrimonio",
      other: "Otro",
      nameLabel: "Nombre Completo",
      namePlaceholder: "Tu nombre",
      eventTypeLabel: "Tipo de Evento",
      detailsLabel: "Detalles del Evento",
      detailsPlaceholder: "Fecha, ciudad, requerimientos especiales...",
      send: "Enviar Mensaje",
      budgetTitle: "Solicitar Presupuesto",
      budgetDesc: "Para brindarte un presupuesto preciso, necesitamos conocer algunos detalles de tu evento. Serás redirigido a WhatsApp para conversar directamente con nuestro equipo.",
      goToWhatsapp: "Ir a WhatsApp",
      cancel: "Cancelar",
    },
    footer: { rights: "Todos los derechos reservados." },
    admin: {
      loginTitle: "Panel Administrativo",
      passwordLabel: "Contraseña",
      loginButton: "Ingresar",
      loginError: "Contraseña incorrecta. Intente de nuevo.",
      panel: "Panel Admin",
      logout: "Cerrar sesión",
      photos: "Fotos",
      videos: "Videos",
      showsList: "Fechas",
      addPhoto: "Agregar Foto",
      addVideo: "Agregar Video",
      urlLabel: "URL de la imagen/video",
      titleEs: "Título (Español)",
      titleEn: "Título (Inglés)",
      orderLabel: "Orden",
      add: "Agregar",
      edit: "Editar",
      delete: "Eliminar",
      toggleAvail: "Disponibilidad",
      editShow: "Editar Fecha",
      save: "Guardar",
      place: "Lugar",
      day: "Día / Fecha",
      time: "Hora",
      availableLabel: "Disponible",
      confirmDelete: "Confirmar eliminación",
      confirmDeleteDesc: "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
      confirm: "Confirmar",
    },
  },
  en: {
    nav: { home: "Home", biography: "Biography", shows: "Shows", contact: "Contact" },
    hero: { title: "Professional Entertainment", subtitle: "Live music that transforms your event" },
    biography: {
      title: "Biography",
      text1: "Jeff Buitrago is a Colombian singer and songwriter who has built his artistic identity through passion, discipline, and a deep connection with romantic, ranchera, and popular music.",
      text2: "From an early age, he discovered in music a way to express real emotions and tell stories that connect directly with the heart of the audience. His career includes performances at private events, corporate events and festivals, where he has shown versatility, professionalism and total dedication in every performance.",
      text3: "Today, Jeff positions himself as one of the emerging voices of Colombian popular music, with his own style that blends tradition and modernity.",
    },
    gallery: { title: "Gallery", photos: "Photos", videos: "Videos" },
    shows: {
      title: "Upcoming Dates",
      reserve: "Reserve",
      soldOut: "Sold Out",
      liveShow: "Live Performance",
      noShows: "No upcoming dates at the moment.",
      addShow: "Add Date",
      dayLabel: "Day / Date (e.g. May 15)",
      placeLabel: "Location (e.g. Bogotá)",
      timeLabel: "Time (e.g. 8:00 PM)",
      confirmTitle: "Confirm Reservation",
      confirmDesc: "You will be redirected to WhatsApp to coordinate the details of your reservation in",
      cancel: "Cancel",
      goToWhatsapp: "Continue to WhatsApp",
      available: "Available",
      unavailable: "Unavailable",
    },
    contact: {
      title: "Make Your Event",
      subtitle: "Unforgettable",
      directContact: "Direct Contact",
      requestBudget: "Request a Quote",
      eventTypes: "Event Types",
      private: "Private Event",
      corporate: "Corporate Event",
      festival: "Festival / Concert",
      wedding: "Wedding",
      other: "Other",
      nameLabel: "Full Name",
      namePlaceholder: "Your name",
      eventTypeLabel: "Event Type",
      detailsLabel: "Event Details",
      detailsPlaceholder: "Date, city, special requirements...",
      send: "Send Message",
      budgetTitle: "Request a Quote",
      budgetDesc: "To provide you with an accurate quote, we need to know some details about your event. You will be redirected to WhatsApp to speak directly with our team.",
      goToWhatsapp: "Go to WhatsApp",
      cancel: "Cancel",
    },
    footer: { rights: "All rights reserved." },
    admin: {
      loginTitle: "Admin Panel",
      passwordLabel: "Password",
      loginButton: "Login",
      loginError: "Incorrect password. Please try again.",
      panel: "Admin Panel",
      logout: "Log out",
      photos: "Photos",
      videos: "Videos",
      showsList: "Shows",
      addPhoto: "Add Photo",
      addVideo: "Add Video",
      urlLabel: "Image/Video URL",
      titleEs: "Title (Spanish)",
      titleEn: "Title (English)",
      orderLabel: "Order",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      toggleAvail: "Availability",
      editShow: "Edit Show",
      save: "Save",
      place: "Location",
      day: "Day / Date",
      time: "Time",
      availableLabel: "Available",
      confirmDelete: "Confirm deletion",
      confirmDeleteDesc: "Are you sure you want to delete this item? This action cannot be undone.",
      confirm: "Confirm",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
