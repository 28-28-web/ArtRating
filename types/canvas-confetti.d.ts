declare module 'canvas-confetti' {
  export interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    gravity?: number;
    colors?: string[];
    ticks?: number;
    decay?: number;
    scalar?: number;
  }

  export function create(canvas: HTMLCanvasElement, opts?: ConfettiOptions): () => void;
}
