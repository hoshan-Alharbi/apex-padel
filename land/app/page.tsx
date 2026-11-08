import { SiteFooter, SiteHeader } from '@/components/sections/Chrome';
import { Download, Steps } from '@/components/sections/Closing';
import { Facts, Features } from '@/components/sections/Features';
import { Hero } from '@/components/sections/Hero';
import { Split } from '@/components/sections/Split';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Facts />
        <Features />
        <Split />
        <Steps />
        <Download />
      </main>
      <SiteFooter />
    </>
  );
}
