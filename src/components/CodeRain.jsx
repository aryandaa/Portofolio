import { useEffect, useRef } from "react";

const snippets = [
  "0101",
  "1010",
  "const",
  "await",
  "=>",
  "useState()",
  "npm run",
  ".map()",
  "fetch()",
  "return",
  "def",
  "import",
  "class",
  "print()",
  "lambda",
  "if True:",
  "display:flex;",
  "grid",
  "#22d3ee",
  "z-index",
  "@media",
  "padding",
  "{ }",
  "</>",
];

const palette = [
  "rgba(34, 211, 238, 0.72)",
  "rgba(139, 92, 246, 0.62)",
  "rgba(255, 46, 99, 0.58)",
  "rgba(219, 234, 254, 0.42)",
];

function createStream(width, height, index) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 0.7 + Math.random() * 1.45,
    gap: 20 + Math.random() * 16,
    length: 10 + Math.floor(Math.random() * 14),
    fontSize: 12 + Math.floor(Math.random() * 6),
    color: palette[index % palette.length],
    alpha: 0.48 + Math.random() * 0.42,
    tokens: Array.from(
      { length: 20 },
      () => snippets[Math.floor(Math.random() * snippets.length)],
    ),
  };
}

export default function CodeRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameId;
    let streams = [];
    let width = 0;
    let height = 0;
    let lastFrame = 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const streamCount = Math.max(22, Math.floor(width / 58));
      streams = Array.from({ length: streamCount }, (_, index) =>
        createStream(width, height, index),
      );
    };

    const draw = (timestamp) => {
      const delta = Math.min(timestamp - lastFrame, 32) || 16;
      lastFrame = timestamp;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(7, 9, 20, 0.08)";
      context.fillRect(0, 0, width, height);

      streams.forEach((stream) => {
        context.font = `${stream.fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
        context.textBaseline = "top";

        for (let index = 0; index < stream.length; index += 1) {
          const token = stream.tokens[index % stream.tokens.length];
          const y = stream.y - index * stream.gap;
          const fade = Math.max(0, 1 - index / stream.length);

          context.globalAlpha = stream.alpha * fade;
          context.fillStyle = index === 0 ? "rgba(255, 255, 255, 0.82)" : stream.color;
          context.shadowBlur = index === 0 ? 14 : 8;
          context.shadowColor = stream.color;
          context.fillText(token, stream.x, y);
        }

        stream.y += stream.speed * (delta / 16);

        if (stream.y - stream.length * stream.gap > height + 120) {
          Object.assign(stream, createStream(width, height, Math.floor(Math.random() * 100)));
          stream.y = -40 - Math.random() * height * 0.45;
        }
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      frameId = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frameId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="code-rain-canvas" aria-hidden="true" />;
}
