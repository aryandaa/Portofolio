import { useEffect, useRef } from "react";

const trailCount = 10;
const colors = ["#22d3ee", "#8b5cf6", "#ff2e63"];

export default function CyberCursor() {
  const cursorRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const canUseFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canUseFinePointer || prefersReducedMotion) {
      return undefined;
    }

    const cursor = cursorRef.current;
    const trail = trailRefs.current;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const points = Array.from({ length: trailCount }, () => ({ ...target }));
    let frameId;
    let isVisible = false;

    const setVisibility = (visible) => {
      isVisible = visible;
      cursor?.classList.toggle("is-visible", visible);
      trail.forEach((node) => node?.classList.toggle("is-visible", visible));
    };

    const handleMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!isVisible) setVisibility(true);
    };

    const handleLeave = () => setVisibility(false);

    const animate = () => {
      cursor?.style.setProperty("--x", `${target.x}px`);
      cursor?.style.setProperty("--y", `${target.y}px`);

      points.forEach((point, index) => {
        const previous = index === 0 ? target : points[index - 1];
        const ease = 0.28 - index * 0.012;

        point.x += (previous.x - point.x) * ease;
        point.y += (previous.y - point.y) * ease;

        const node = trail[index];
        node?.style.setProperty("--x", `${point.x}px`);
        node?.style.setProperty("--y", `${point.y}px`);
      });

      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="cyber-cursor-layer" aria-hidden="true">
      <span ref={cursorRef} className="cyber-cursor-core" />
      {Array.from({ length: trailCount }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className="cyber-cursor-trail"
          style={{
            "--size": `${30 - index * 1.8}px`,
            "--delay-opacity": `${1 - index * 0.075}`,
            "--trail-color": colors[index % colors.length],
          }}
        />
      ))}
    </div>
  );
}
