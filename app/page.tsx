import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import WhatWeDo from "@/components/home/WhatWeDo";
import Stats from "@/components/home/Stats";
import Advantages from "@/components/home/Advantages";
import Cases from "@/components/home/Cases";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <WhatWeDo />
      <Stats />
      <Advantages />
      <Cases />
      <CTA />
      <Footer />
    </>
  );
}
