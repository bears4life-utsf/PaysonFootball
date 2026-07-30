import type { Metadata } from "next";

import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { WaiverSigner } from "@/components/waiver-signer";

export const metadata: Metadata = {
  title: "Parade Waiver",
  description:
    "Sign the Santaquin Orchard Days parade waiver for Payson Lions Football.",
};

export default function ParadeWaiverPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F4]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-black text-white">
          <div aria-hidden className="absolute inset-0 bg-[#043D25]" />
          <div aria-hidden className="field-glow absolute inset-0 opacity-60" />
          <div aria-hidden className="yard-lines absolute inset-0 opacity-[0.12]" />
          <div className="relative mx-auto flex min-h-[180px] w-full max-w-6xl flex-col justify-center px-4 py-8 sm:min-h-[220px] sm:px-6">
            <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight sm:text-5xl md:text-6xl">
              Parade Waiver
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
              Fill in the lines and sign both signature areas directly on the
              waiver, then submit.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl py-8 sm:px-6 sm:py-10">
          <WaiverSigner />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
