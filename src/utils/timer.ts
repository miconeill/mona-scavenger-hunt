export class GameTimer {
  private startTime: number = 0;
  private elapsed: number = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;
  private onTick?: (elapsed: number) => void;
  private pausedAt: number = 0;
  private visibilityHandler: (() => void) | null = null;

  constructor(onTick?: (elapsed: number) => void) {
    this.onTick = onTick;
  }

  start(): void {
    if (this.isRunning) return;
    this.startTime = Date.now();
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.elapsed = Date.now() - this.startTime;
      this.onTick?.(this.elapsed);
    }, 100);

    this.registerVisibilityHandler();
  }

  stop(): number {
    if (!this.isRunning) return this.elapsed;
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.unregisterVisibilityHandler();
    this.elapsed = Date.now() - this.startTime;
    return this.elapsed;
  }

  reset(): void {
    this.stop();
    this.elapsed = 0;
    this.startTime = 0;
    this.pausedAt = 0;
  }

  getElapsed(): number {
    if (this.isRunning) {
      return Date.now() - this.startTime;
    }
    return this.elapsed;
  }

  private registerVisibilityHandler(): void {
    this.visibilityHandler = () => {
      if (document.hidden) {
        // Tab became hidden — pause
        this.pausedAt = Date.now();
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      } else {
        // Tab became visible — resume
        // BUG: We adjust startTime forward, but if the player pauses/resumes
        // multiple times rapidly, the elapsed calculation drifts because
        // we don't account for the interval between pausedAt and now
        // when pausedAt is 0 (never actually paused)
        const pauseDuration = Date.now() - this.pausedAt;
        this.startTime += pauseDuration;

        this.intervalId = setInterval(() => {
          this.elapsed = Date.now() - this.startTime;
          this.onTick?.(this.elapsed);
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", this.visibilityHandler);
  }

  private unregisterVisibilityHandler(): void {
    if (this.visibilityHandler) {
      document.removeEventListener("visibilitychange", this.visibilityHandler);
      this.visibilityHandler = null;
    }
  }

  formatElapsed(ms?: number): string {
    const total = ms ?? this.elapsed;
    const seconds = Math.floor(total / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}
