import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Biography } from "@/components/Biography";
import { PhotoGallery } from "@/components/PhotoGallery";
import { VideoGallery } from "@/components/VideoGallery";
import { Shows } from "@/components/Shows";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";

export function Home() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div id="inicio" className="min-h-[100dvh] bg-black text-foreground selection:bg-primary selection:text-black">
      <Navigation />
      <Hero />
      <Biography />
      <PhotoGallery />
      <VideoGallery />
      <Shows />
      <ContactForm />
      <Footer />
    </div>
  );
}
