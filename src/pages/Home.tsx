import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Amenities from '../components/Amenities';
import Membership from '../components/Membership';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  return (
    <>
      <Hero onAnimationComplete={onAnimationComplete} />
      <Stats />
      <Amenities />
      <Membership />
      <Testimonials />
      <CTA />
    </>
  );
}
