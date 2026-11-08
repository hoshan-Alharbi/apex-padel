import { Download, Features, Hero, SiteFooter, SiteHeader } from '@/components/Sections';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <Download />
      </main>
      <SiteFooter />
    </>
  );
}
