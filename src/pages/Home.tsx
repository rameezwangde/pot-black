import Hero from '../components/Hero';
import Stats from '../components/Stats';
import RecommendedActivities from '../components/RecommendedActivities';
import Amenities from '../components/Amenities';
import ProTipsAndSuggestions from '../components/ProTipsAndSuggestions';
import Membership from '../components/Membership';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home({ animationFinished, onAnimationComplete }: { animationFinished: boolean; onAnimationComplete: () => void }) {
  return (
    <>
      <Hero initiallyFinished={animationFinished} onAnimationComplete={onAnimationComplete} />
      <Stats />
      <RecommendedActivities />
      <Amenities />
      <ProTipsAndSuggestions />
      <Membership />
      <Testimonials />
      <CTA />
    </>
  );
}

