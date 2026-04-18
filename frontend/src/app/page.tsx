import Hero from '@/components/landing/Hero';
import ProblemStatement from '@/components/landing/ProblemStatement';
import HowItWorks from '@/components/landing/HowItWorks';
import FeatureModules from '@/components/landing/FeatureModules';
import MembershipPreview from '@/components/landing/MembershipPreview';
import HotDeals from '@/components/landing/HotDeals';
import ImpactStats from '@/components/landing/ImpactStats';
import BeforeAfterReveal from '@/components/landing/BeforeAfterReveal';
import CTASection from '@/components/landing/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemStatement />
      <HowItWorks />
      <FeatureModules />
      <MembershipPreview />
      <HotDeals />
      <ImpactStats />
      <BeforeAfterReveal 
        beforeImage="/before-impact.png" 
        afterImage="/after-impact.png" 
      />
      <CTASection />
    </>
  );
}
