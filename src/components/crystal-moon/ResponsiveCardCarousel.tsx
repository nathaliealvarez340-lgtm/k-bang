"use client";

import { cloneElement, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement } from "react";
import { useCompactLayout } from "./useCompactLayout";

type Props<T> = {
  as?: "div" | "ol";
  className: string;
  items: readonly T[];
  label: string;
  locale: "es" | "en";
  renderItem: (item: T, index: number) => ReactElement;
};

const AUTOPLAY_DELAY = 4000;
const INTERACTION_PAUSE = 6000;

export function ResponsiveCardCarousel<T>({
  as: Tag = "div",
  className,
  items,
  label,
  locale,
  renderItem,
}: Props<T>) {
  const compact = useCompactLayout();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const scrollTimerRef = useRef<number | undefined>(undefined);
  const lastInteractionRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [physicalIndex, setPhysicalIndex] = useState(1);
  const [interactionCount, setInteractionCount] = useState(0);
  const [nearViewport, setNearViewport] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const scrollToSlide = useCallback((position: number, smooth: boolean) => {
    const track = trackRef.current;
    const slide = track?.children[position] as HTMLElement | undefined;
    if (!track || !slide) return;
    const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
    track.scrollTo({ left, behavior: smooth && !reducedMotion ? "smooth" : "instant" });
    setPhysicalIndex(position);
  }, [reducedMotion]);

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setInteractionCount((count) => count + 1);
  }, []);

  const settleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !items.length) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const slides = Array.from(track.children) as HTMLElement[];
    let nearest = 0;
    let distance = Infinity;

    slides.forEach((slide, index) => {
      const delta = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      if (delta < distance) {
        nearest = index;
        distance = delta;
      }
    });

    if (nearest === 0 || nearest === items.length + 1) {
      const realPosition = nearest === 0 ? items.length : 1;
      scrollToSlide(realPosition, false);
      nearest = realPosition;
    }
    setPhysicalIndex(nearest);
    setActiveIndex(nearest - 1);
  }, [items.length, scrollToSlide]);

  useLayoutEffect(() => {
    if (compact && items.length) scrollToSlide(1, false);
  }, [compact, items.length, scrollToSlide]);

  useEffect(() => {
    if (!compact) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [compact]);

  useEffect(() => {
    if (!compact || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "120px 0px 120px 0px", threshold: 0.2 },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [compact]);

  useEffect(() => {
    if (!compact) return;
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [compact]);

  useEffect(() => {
    if (!compact || !nearViewport || !pageVisible || reducedMotion || items.length < 2) return;
    const remainingPause = Math.max(0, lastInteractionRef.current + INTERACTION_PAUSE - Date.now());
    const timer = window.setTimeout(() => {
      const next = activeIndex + 1;
      scrollToSlide(next === items.length ? items.length + 1 : next + 1, true);
      setActiveIndex(next % items.length);
    }, remainingPause + AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, compact, interactionCount, items.length, nearViewport, pageVisible, reducedMotion, scrollToSlide]);

  useEffect(() => () => window.clearTimeout(scrollTimerRef.current), []);

  if (!compact || items.length < 2) {
    return <Tag className={className}>{items.map(renderItem)}</Tag>;
  }

  const slides = [
    { item: items[items.length - 1], index: items.length - 1, clone: true },
    ...items.map((item, index) => ({ item, index, clone: false })),
    { item: items[0], index: 0, clone: true },
  ];

  const goTo = (index: number) => {
    markInteraction();
    scrollToSlide(index + 1, true);
    setActiveIndex(index);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const slide = (event.target as HTMLElement).closest<HTMLElement>("[data-carousel-slide]");
    if (!slide || !trackRef.current?.contains(slide)) return;
    const position = Number(slide.dataset.carouselSlide);
    if (position === physicalIndex) return;
    markInteraction();
    scrollToSlide(position, true);
    setActiveIndex((position - 1 + items.length) % items.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    markInteraction();
    const next = event.key === "ArrowRight" ? activeIndex + 1 : activeIndex - 1;
    const position = next < 0 ? 0 : next === items.length ? items.length + 1 : next + 1;
    scrollToSlide(position, true);
    setActiveIndex((next + items.length) % items.length);
  };

  return (
    <div className="responsive-carousel" ref={containerRef} role="region" aria-roledescription={locale === "es" ? "carrusel" : "carousel"} aria-label={label}>
      <Tag
        className={`${className} responsive-carousel__track`}
        ref={trackRef as never}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerDown={markInteraction}
        onWheel={markInteraction}
        onScroll={() => {
          window.clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = window.setTimeout(settleScroll, 160);
        }}
      >
        {slides.map(({ item, index, clone }, position) => cloneElement(
          renderItem(item, index) as ReactElement<HTMLAttributes<HTMLElement>>,
          {
            key: `slide-${position}`,
            "data-carousel-slide": position,
            "data-carousel-active": position === physicalIndex ? "true" : undefined,
            "aria-hidden": clone || undefined,
          } as HTMLAttributes<HTMLElement>,
        ))}
      </Tag>
      <div className="responsive-carousel__indicators" aria-label={locale === "es" ? "Seleccionar tarjeta" : "Select card"}>
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            className="responsive-carousel__dot"
            aria-label={locale === "es" ? `Ir a tarjeta ${index + 1} de ${items.length}` : `Go to card ${index + 1} of ${items.length}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
