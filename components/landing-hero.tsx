"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Menu,
  PawPrint,
  X,
} from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { LottieCat } from "@/components/lottie-cat";

const heroBackground = {
  backgroundColor: "#f47a2a",
  backgroundImage: 'url("/orange-paper-texture.webp")',
  backgroundPosition: "center",
  backgroundSize: "cover",
} as const;

export function LandingHero() {
  const t = useTranslations();
  const router = useRouter();
  const [clicked, setClicked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const handleStart = () => {
    if (clicked) return;
    setClicked(true);
    window.setTimeout(() => router.push("/app"), 360);
  };

  const menuLinks = [
    { href: "/app", label: t("nav.analyze") },
    { href: "/trends", label: t("nav.trends") },
    { href: "/history", label: t("nav.history") },
    { href: "/pricing", label: t("nav.pricing") },
  ];

  return (
    <main
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden text-white"
      style={heroBackground}
    >
      <nav
        className="relative z-30 flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 md:px-10 lg:px-14"
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2 rounded-full px-1 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/90"
        >
          <span className="grid size-9 place-items-center rounded-full bg-white text-[#d9571b] shadow-[0_6px_20px_rgba(124,50,14,0.18)]">
            <PawPrint className="size-[19px]" strokeWidth={2.6} aria-hidden="true" />
          </span>
          <span className="text-[17px] font-black tracking-[-0.035em] sm:text-lg">
            PawNotes
          </span>
        </Link>

        <div className="hidden items-center gap-1.5 md:flex">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#bd4512] shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex min-h-11 items-center gap-2 rounded-full bg-[#b94614] px-4 text-sm font-bold text-white shadow-[0_8px_24px_rgba(116,40,8,0.22)] transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="size-4" strokeWidth={2.5} aria-hidden="true" />
          <span>Menu</span>
        </button>
      </nav>

      <section className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[45%] flex -translate-x-1/2 -translate-y-1/2 select-none flex-col items-center whitespace-nowrap text-[29vw] font-black leading-[0.84] tracking-[-0.02em] text-[#ffd6a4]/40 sm:text-[23vw] md:text-[16vw] lg:text-[11.5rem]"
        >
          <span>HEAR</span>
          <span>YOUR</span>
          <span className="tracking-[0.08em]">PET</span>
        </div>

        <PawPrint
          aria-hidden="true"
          className="absolute left-[10%] top-[28%] size-7 -rotate-12 fill-white/10 text-[#fff0cf] drop-shadow-sm sm:left-[18%] sm:size-9"
          strokeWidth={1.9}
        />
        <PawPrint
          aria-hidden="true"
          className="absolute right-[11%] top-[20%] size-4 rotate-[18deg] fill-white/10 text-white/75 sm:right-[19%] sm:size-6"
          strokeWidth={1.9}
        />

        <button
          type="button"
          onClick={handleStart}
          className={`relative z-10 mt-2 aspect-square w-[min(86vw,27rem)] translate-y-7 touch-manipulation rounded-[44%] outline-none transition-all duration-300 focus-visible:ring-4 focus-visible:ring-white/80 sm:w-[min(74vw,29rem)] sm:translate-y-4 ${
            clicked
              ? "scale-125 opacity-0"
              : "active:scale-[0.97] motion-safe:hover:scale-[1.025]"
          }`}
          aria-label={t("landing.cta")}
        >
          <LottieCat className="h-full w-full drop-shadow-[0_24px_24px_rgba(120,45,10,0.2)]" />
        </button>
      </section>

      <section className="relative z-20 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center sm:px-8 sm:pb-8">
        <div className="mx-auto -translate-y-8 max-w-md sm:translate-y-0">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#92370f] sm:text-xs">
            {t("landing.tagline")}
          </p>
          <h1 className="text-[clamp(1.55rem,7vw,2.25rem)] font-black leading-[1.05] tracking-[-0.04em] text-white drop-shadow-[0_2px_0_rgba(138,47,10,0.18)]">
            {t("landing.title")}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-[13px] font-medium leading-5 text-white/80 sm:text-sm">
            {t("landing.subtitle")}
          </p>

          <button
            type="button"
            onClick={handleStart}
            className="mt-4 flex min-h-14 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-black text-[#c94d16] shadow-[0_12px_30px_rgba(120,43,8,0.2)] transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/55 sm:mx-auto sm:max-w-sm"
          >
            {t("landing.cta")}
            <ArrowRight className="size-5" strokeWidth={2.6} aria-hidden="true" />
          </button>
        </div>
      </section>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 transition-[visibility] ${
          menuOpen ? "visible" : "invisible delay-300"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-[#56200d]/45 backdrop-blur-[2px] transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close menu"
        />

        <aside
          className={`absolute inset-y-0 right-0 flex w-[min(88vw,25rem)] flex-col overflow-hidden border-l border-white/20 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] shadow-[-24px_0_60px_rgba(83,25,5,0.28)] transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={heroBackground}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black">
              <span className="grid size-9 place-items-center rounded-full bg-white text-[#d9571b]">
                <PawPrint className="size-[19px]" strokeWidth={2.6} aria-hidden="true" />
              </span>
              PawNotes
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="grid size-12 place-items-center rounded-full bg-[#b94614] text-white transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              tabIndex={menuOpen ? 0 : -1}
              aria-label="Close menu"
            >
              <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            {menuLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-14 items-center justify-between rounded-2xl border border-white/25 bg-white/10 px-5 text-lg font-black text-white backdrop-blur-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  menuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-6 opacity-0"
                }`}
                style={{ transitionDelay: menuOpen ? `${80 + index * 45}ms` : "0ms" }}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              handleStart();
            }}
            className="mt-auto flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-5 font-black text-[#c94d16] shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/55"
            tabIndex={menuOpen ? 0 : -1}
          >
            {t("landing.cta")}
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </aside>
      </div>
    </main>
  );
}
