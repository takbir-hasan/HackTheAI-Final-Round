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
      <HeroSection />
      <ChatSection />
      <ServicesSection />
      <FuturePlan />
      <Footer />
    </div>
  );
}
