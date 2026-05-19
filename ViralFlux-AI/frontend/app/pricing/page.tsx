import { Pricing } from '@/components/landing/Pricing';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-surface-950 pt-20">
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  );
}
