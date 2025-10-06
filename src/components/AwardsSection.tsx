"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

import { awardsAndRecognitions } from "@/data/profile";
import type { AwardEntry } from "@/data/profile";

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.15 + index * 0.08,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

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

const AwardTile = ({ award, index }: { award: AwardEntry; index: number }) => {
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
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-secondary/25 bg-gradient-to-b from-darkBg/85 via-darkBg/70 to-darkBg/95 shadow-lg shadow-secondary/10 transition-all duration-500 group-hover:border-secondary/60 group-hover:shadow-secondary/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc}
          alt={award.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={isRemoteImage && award.fallbackImage ? handleImageError : undefined}
          priority={index < 3}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-darkBg/90 via-darkBg/20 to-transparent" aria-hidden="true" />
        {award.highlight ? (
          <span className="absolute top-4 left-4 rounded-full bg-secondary/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-darkBg">
            {award.highlight}
          </span>
        ) : (
          <span className="absolute top-4 left-4 rounded-full bg-darkBg/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            Award
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <span className="text-xs uppercase tracking-[0.3em] text-secondary/80">{award.year}</span>
        <h3 className="mt-3 text-lg font-semibold text-lightText transition-colors duration-300 group-hover:text-secondary">
          {award.title}
        </h3>
        <p className="mt-3 flex-1 text-sm text-lightText/70">{award.description}</p>
        <div className="mt-5 flex items-center justify-between text-sm text-lightText/70">
          <span className="font-medium text-lightText/90">{award.issuer}</span>
          {award.link && (
            <span className="inline-flex items-center gap-2 text-cyan-300 transition-colors duration-300 group-hover:text-cyan-100">
              View
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (award.link) {
    const isExternal = /^https?:\/\//.test(award.link);
    const href = isExternal ? award.link : award.link.startsWith("/") ? award.link : `/${award.link}`;

    return isExternal ? (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-darkBg"
        variants={cardVariants}
        custom={index}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
      >
        {tileContent}
      </motion.a>
    ) : (
      <motion.div
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-darkBg"
        variants={cardVariants}
        custom={index}
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
      variants={cardVariants}
      custom={index}
    >
      {tileContent}
    </motion.div>
  );
};

const AwardsSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLUListElement | null>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [gridHeights, setGridHeights] = useState({ collapsed: 0, expanded: 0 });
  const [hasScrollableOverflow, setHasScrollableOverflow] = useState(false);
  const [firstRowCount, setFirstRowCount] = useState(0);

  const computeGridHeights = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.children) as HTMLElement[];
    if (cards.length === 0) {
      setGridHeights({ collapsed: 0, expanded: 0 });
      setFirstRowCount(0);
      setHasScrollableOverflow(false);
      return;
    }

    const rowOffsets = new Map<number, { bottom: number; count: number }>();

    cards.forEach((card) => {
      const top = card.offsetTop;
      const bottom = top + card.offsetHeight;
      const existing = rowOffsets.get(top);

      if (existing) {
        existing.count += 1;
        if (bottom > existing.bottom) {
          existing.bottom = bottom;
        }
      } else {
        rowOffsets.set(top, { bottom, count: 1 });
      }
    });

    const orderedRows = Array.from(rowOffsets.entries())
      .map(([top, value]) => ({ top, ...value }))
      .sort((a, b) => a.top - b.top);

    if (orderedRows.length === 0) {
      setGridHeights({ collapsed: 0, expanded: 0 });
      setFirstRowCount(0);
      setHasScrollableOverflow(false);
      return;
    }

    const collapsedBottom = orderedRows[0].bottom;
    const expandedBottom = orderedRows[orderedRows.length - 1].bottom;

    const computedStyles = window.getComputedStyle(grid);
    const rowGap = Number.parseFloat(computedStyles.rowGap || "0");

    const collapsedHeight = collapsedBottom + rowGap * 0.5;
    const expandedHeight = expandedBottom + rowGap;

    setGridHeights((prev) => {
      if (prev.collapsed === collapsedHeight && prev.expanded === expandedHeight) {
        return prev;
      }

      return { collapsed: collapsedHeight, expanded: expandedHeight };
    });

    setFirstRowCount(orderedRows[0]?.count ?? cards.length);

    const expandedThreshold = expandedHeight || collapsedHeight;
    setHasScrollableOverflow(grid.scrollHeight > expandedThreshold + 1);
  }, []);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let frame: number | null = null;

    const measure = () => {
      frame = null;
      computeGridHeights();
    };

    measure();

    const handleResize = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(measure);
    };

    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(handleResize);
      observer.observe(grid);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer) {
        observer.disconnect();
      }
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, [computeGridHeights]);

  const measurementReady = gridHeights.collapsed > 0;
  const collapsedVisibleCount = measurementReady
    ? firstRowCount
    : Math.min(awardsAndRecognitions.length, 3);
  const canExpand =
    awardsAndRecognitions.length > collapsedVisibleCount &&
    (gridHeights.expanded > gridHeights.collapsed + 1 || hasScrollableOverflow);
  const remainingCollapsedCount = Math.max(awardsAndRecognitions.length - collapsedVisibleCount, 0);

  const handleToggle = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (!next && gridRef.current) {
        gridRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return next;
    });
  };

  return (
    <section id="awards" className="relative py-20" ref={sectionRef}>
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
            <span className="gradient-text cyan-glow">Awards & Recognition</span>
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
              <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"}>
                <ul
                  id="awards-grid"
                  ref={gridRef as unknown as React.RefObject<HTMLUListElement>}
                  className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 transition-[max-height] duration-500 ease-in-out will-change-[max-height] ${
                    isExpanded
                      ? hasScrollableOverflow
                        ? "overflow-y-auto pr-1 sm:pr-2"
                        : "overflow-visible"
                      : "overflow-hidden"
                  }`}
                  style={{
                    maxHeight: !measurementReady
                      ? undefined
                      : isExpanded
                        ? hasScrollableOverflow
                          ? `${gridHeights.expanded}px`
                          : undefined
                        : `${gridHeights.collapsed}px`,
                  }}
                >
                  {awardsAndRecognitions.map((award, index) => (
                    <li key={`${award.title}-${award.year}`}>
                      <AwardTile award={award} index={index} />
                    </li>
                  ))}
                </ul>
              </motion.div>

              {!isExpanded && canExpand && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-darkBg via-darkBg/70 to-transparent" aria-hidden="true" />
              )}
            </div>

            {canExpand && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={handleToggle}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleToggle();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] hover:bg-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-darkBg [touch-action:manipulation]"
                >
                  {isExpanded ? "Collapse awards" : "View more awards"}
                  {!isExpanded && remainingCollapsedCount > 0 && (
                    <span className="sr-only">{` - expands to show ${remainingCollapsedCount} more award${remainingCollapsedCount === 1 ? "" : "s"}.`}</span>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isExpanded && hasScrollableOverflow && (
                  <p className="mt-3 text-xs text-lightText/60">Scroll within the grid to discover the full list of awards.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AwardsSection;
