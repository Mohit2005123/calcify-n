import Navbar from "@/components/landingpage/Navbar";
import Hero from "@/components/landingpage/Hero";
import { AppleCardsCarouselDemo } from "@/components/landingpage/Carousel";
import { StickyScrollRevealDemo } from "@/components/landingpage/StickyScroll";
import Footer from "@/components/landingpage/Footer";
import { HeroParallaxDemo } from "@/components/landingpage/ScrollParrallax";
import { InfiniteMovingCardsDemo } from "@/components/landingpage/MovingCards";
export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="mt-16">
        <Hero />
        <AppleCardsCarouselDemo />
        <HeroParallaxDemo />
        <StickyScrollRevealDemo />
        <InfiniteMovingCardsDemo />
        <Footer />
      </div>
    </div>
  );
}