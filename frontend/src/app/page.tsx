import Navbar from "./navbar";
import HeroSection from "./components/HeroSection";
import ChatSection from "./components/ChatSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ChatSection />
    </div>
  );
}
