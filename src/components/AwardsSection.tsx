"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { awardsAndRecognitions } from "@/data/profile";
import type { AwardEntry } from "@/data/profile";

const resolveImageSource = (source: AwardEntry["image"]) => {
  if (typeof source !== "string") return source;

  // Normalize Windows backslashes to web-friendly slashes
  let normalized = source.replace(/\\/g, "/");

  // Drop any leading './'
  normalized = normalized.replace(/^\.\//, "");

  // If it points into public/, strip that segment since Next serves public at '/'
  normalized = normalized.replace(/^public\//, "");

  // If it's already absolute URL, return as is
  if (/^https?:\/\//.test(normalized)) return normalized;

  // Ensure it starts at web root
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
};

interface AwardTileProps {
  award: AwardEntry;
  index: number;
  isFeatured: boolean;
  onPreviewPdf: (title: string, href: string, trigger: HTMLButtonElement) => void;
}

const AwardTile = ({ award, index, isFeatured, onPreviewPdf }: AwardTileProps) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = resolveImageSource(
    imageError && award.fallbackImage ? award.fallbackImage : award.image,
  );
  const isRemoteImage = typeof imageSrc === "string" && /^https?:\/\//.test(imageSrc);

  const handleImageError = () => {
    if (!imageError && award.fallbackImage) {
      setImageError(true);
    }
  };

  const tileContent = (
    <div className="group relative aspect-square h-full overflow-hidden rounded-3xl border border-white/15 bg-black shadow-lg shadow-black/20 transition-all duration-500 hover:border-white/35 hover:shadow-black/40">
      <Image
        src={imageSrc}
        alt={award.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={isRemoteImage && award.fallbackImage ? handleImageError : undefined}
        priority={index < 3}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" aria-hidden="true" />

      <span className="absolute left-4 top-4 z-20 rounded-full border border-white/25 bg-black/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
        {isFeatured ? "Featured" : "Award"}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-black/75 px-5 pb-5 pt-10 backdrop-blur-sm">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-300">{award.year}</span>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-white">{award.title}</h3>
        <div className="mt-4 flex items-end justify-between gap-3 text-sm">
          <span className="line-clamp-2 font-medium text-zinc-200">{award.issuer}</span>
          {award.link && (
            <span className="inline-flex shrink-0 items-center gap-2 text-zinc-300">
              View
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 p-6 text-center opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
          {award.highlight ?? "Award details"}
        </span>
        <p className="mt-4 line-clamp-6 text-sm leading-relaxed text-zinc-200">{award.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
          View award
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </div>
    </div>
  );

  if (award.link) {
    const isExternal = /^https?:\/\//.test(award.link);
    const href = isExternal ? award.link : award.link.startsWith("/") ? award.link : `/${award.link}`;
    const isPdf = href.split(/[?#]/, 1)[0].toLowerCase().endsWith(".pdf");

    return isPdf ? (
      <motion.button
        type="button"
        onClick={(event) => onPreviewPdf(award.title, href, event.currentTarget)}
        aria-haspopup="dialog"
        aria-label={`Preview ${award.title} PDF`}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-darkBg"
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
      >
        {tileContent}
      </motion.button>
    ) : isExternal ? (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-darkBg"
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
      >
        {tileContent}
      </motion.a>
    ) : (
      <motion.div
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-darkBg"
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link href={href} className="block">{tileContent}</Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="cursor-default"
      role="group"
    >
      {tileContent}
    </motion.div>
  );
};

const AwardsSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const closePreviewButtonRef = useRef<HTMLButtonElement | null>(null);
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);
  // Expanding changes the section height. Reveal only once so that the
  // intersection threshold cannot hide the cards after they are added.
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<{ title: string; href: string } | null>(null);
  const reduceMotion = useReducedMotion();
  const initialAwardCount = 3;
  const sortedAwards = awardsAndRecognitions
    .map((award, sourceIndex) => ({ award, sourceIndex }))
    .sort((a, b) => Number(b.award.year) - Number(a.award.year) || a.sourceIndex - b.sourceIndex)
    .map(({ award }) => award);
  const totalAwards = sortedAwards.length;
  const visibleAwards = isExpanded ? sortedAwards : sortedAwards.slice(0, initialAwardCount);
  const remainingAwardsCount = Math.max(totalAwards - visibleAwards.length, 0);
  const canExpand = totalAwards > initialAwardCount;

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (!pdfPreview) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPdfPreview(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closePreviewButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previewTriggerRef.current?.focus();
    };
  }, [pdfPreview]);

  return (
    <section id="awards" className="relative scroll-mt-28 py-20" ref={sectionRef}>
      <div className="absolute inset-x-0 top-12 h-36 bg-gradient-to-r from-secondary/10 via-transparent to-highlight/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-16 right-12 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-secondary/70" />
            <span className="text-xs uppercase tracking-[0.5em] text-secondary/70">Spotlight</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-secondary/70" />
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="gradient-text">Awards & Recognition</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-lightText/70 md:text-base">
            A curated collection of accolades celebrating breakthroughs in human-computer interaction, immersive experiences, and collaborative innovation.
          </p>
        </motion.div>

        {awardsAndRecognitions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-16 max-w-3xl rounded-3xl border border-dashed border-secondary/30 p-10 text-center text-lightText/70"
          >
            <h3 className="text-xl font-semibold text-lightText">Showcase your accolades</h3>
            <p className="mt-3 text-sm">
              Populate <code className="rounded bg-darkBg/60 px-2 py-1">awardsAndRecognitions</code> inside <code className="rounded bg-darkBg/60 px-2 py-1">src/data/profile.ts</code> to highlight your awards here.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="relative mt-16">
              <motion.ul
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  id="awards-grid"
                  className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  <AnimatePresence initial={false}>
                  {visibleAwards.map((award, index) => (
                    <motion.li
                      key={`${award.title}-${award.year}`}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
                      transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut", delay: reduceMotion ? 0 : Math.min(index, 5) * 0.04 }}
                    >
                      <AwardTile
                        award={award}
                        index={index}
                        isFeatured={index === 0}
                        onPreviewPdf={(title, href, trigger) => {
                          previewTriggerRef.current = trigger;
                          setPdfPreview({ title, href });
                        }}
                      />
                    </motion.li>
                  ))}
                  </AnimatePresence>
                </motion.ul>
            </div>

            {canExpand && (
              <div className="text-center mt-12 relative z-10">
                {!isExpanded && remainingAwardsCount > 0 && (
                  <div className="mb-4 flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-darkBg/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-secondary/90 shadow-lg shadow-darkBg/60">
                      +{remainingAwardsCount} more
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleToggle}
                  aria-expanded={isExpanded}
                  aria-controls="awards-grid"
                  className="w-full max-w-xs mx-auto min-h-[48px] py-4 px-6 bg-secondary text-white rounded-md text-lg font-medium shadow-lg active:bg-highlight"
                  style={{ touchAction: "manipulation" }}
                >
                  {isExpanded ? "Show fewer awards" : `Show all ${totalAwards} awards`}
                  {!isExpanded && remainingAwardsCount > 0 && (
                    <span className="sr-only">{` - expands to show ${remainingAwardsCount} more award${remainingAwardsCount === 1 ? "" : "s"}.`}</span>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 inline-block ml-2 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={isExpanded ? "showing-all-awards" : "partial-awards"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 text-sm text-lightText/70"
                    aria-live="polite"
                  >
                    {isExpanded
                      ? `Showing all ${totalAwards} awards.`
                      : `Showing ${visibleAwards.length} of ${totalAwards} awards • ${remainingAwardsCount} more available`}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {pdfPreview && (
          <>
            <motion.button
              type="button"
              aria-label="Close PDF preview"
              className="fixed inset-0 z-40 cursor-default bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPdfPreview(null)}
            />
            <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
              <motion.section
                role="dialog"
                aria-modal="true"
                aria-labelledby="award-pdf-preview-title"
                className="pointer-events-auto flex h-[86dvh] max-h-[900px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              >
              <div className="flex min-h-14 items-center justify-between gap-4 border-b border-white/10 bg-black px-4 sm:px-5">
                <h3 id="award-pdf-preview-title" className="min-w-0 truncate text-sm font-semibold text-white sm:text-base">
                  {pdfPreview.title}
                </h3>
                <button
                  ref={closePreviewButtonRef}
                  type="button"
                  onClick={() => setPdfPreview(null)}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 text-sm font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span aria-hidden="true">×</span>
                  Close
                </button>
              </div>
              <iframe
                src={`${pdfPreview.href}#view=FitH`}
                title={`${pdfPreview.title} PDF preview`}
                className="min-h-0 flex-1 bg-white"
              />
              </motion.section>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AwardsSection;
