import { Hero } from '@/components/home/Hero';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { WhyChoose } from '@/components/home/WhyChoose';
import { LiveAuctionsSection } from '@/components/home/LiveAuctionsSection';
import { DealsOfDaySection } from '@/components/home/DealsOfDaySection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { StatsBand } from '@/components/home/StatsBand';
import { Newsletter } from '@/components/shared/Newsletter';
import { FeaturedAuctionsSection } from '@/components/home/FeaturedAuctionsSection';

export function Home() {
  return (
    <>
      <Hero />
      <FeaturedAuctionsSection />
      <LiveAuctionsSection />
      <CategoriesSection />
      <WhyChoose />
      <DealsOfDaySection />
      <HowItWorks />
      <TestimonialsSection />
      <StatsBand />
      <Newsletter />
    </>
  );
}
