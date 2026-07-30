import type { Metadata } from "next";

import { Header } from "@/components/header";
import { ParadeWaiverForm } from "@/components/parade-waiver-form";
import { SiteFooter } from "@/components/site-footer";
import { WAIVER_PDF_PUBLIC_PATH } from "@/lib/waiver";

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
          <div className="relative mx-auto flex min-h-[200px] w-full max-w-6xl flex-col justify-center px-4 py-10 sm:min-h-[240px] sm:px-6">
            <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-tight sm:text-5xl md:text-6xl">
              Parade Waiver
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
              Required for Payson Lions Football parade participation. Review the
              waiver, then sign both the UDOT and Santaquin City sections below.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
          <div className="overflow-hidden rounded border border-[#C8CDD0] bg-white">
            <div className="border-b border-[#C8CDD0] px-4 py-3 sm:px-5">
              <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-tight text-[#090A0A]">
                Santaquin Orchard Days Parade Waiver
              </h2>
              <p className="mt-1 text-sm text-[#313a36]">
                Read the full waiver, then complete the form underneath.
              </p>
            </div>
            <iframe
              title="Parade waiver PDF"
              src={`${WAIVER_PDF_PUBLIC_PATH}#view=FitH`}
              className="h-[70vh] w-full bg-[#E8EAEB]"
            />
            <div className="border-t border-[#C8CDD0] px-4 py-3 text-sm text-[#313a36] sm:px-5">
              <a
                href={WAIVER_PDF_PUBLIC_PATH}
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded font-medium text-[#075C35] underline underline-offset-2"
              >
                Open PDF in a new tab
              </a>
            </div>
          </div>

          <ParadeWaiverForm />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
