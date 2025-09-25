import Navbar from "./components/navbar";
import HeroSection from "./components/HeroSection";
import ChatSection from "./components/ChatSection";
import ServicesSection from "./components/ServicesSection";
import FuturePlan from "./components/FuturePlan";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section id="hero" className="your-existing-classes">
        <HeroSection />
      </section>
      <ChatSection />
      <section id="services" className="your-existing-classes">
        <ServicesSection />
      </section>
      <FuturePlan />
      <footer id="contact" className="your-existing-classes">
        <Footer />
      </footer>
    </div>
  );
}
