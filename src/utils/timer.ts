export class GameTimer {
  private startTime: number = 0;
  private elapsed: number = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;
  private onTick?: (elapsed: number) => void;

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
  }

  stop(): number {
    if (!this.isRunning) return this.elapsed;
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.elapsed = Date.now() - this.startTime;
    return this.elapsed;
  }

  reset(): void {
    this.stop();
    this.elapsed = 0;
    this.startTime = 0;
  }

  getElapsed(): number {
    if (this.isRunning) {
      return Date.now() - this.startTime;
    }
    return this.elapsed;
  }

  // TODO: Handle visibility change (tab switching)
  // The timer keeps running even when the tab is inactive,
  // which unfairly penalizes players who switch tabs.
  // Should pause/resume based on document.visibilitychange event.

  formatElapsed(ms?: number): string {
    const total = ms ?? this.elapsed;
    const seconds = Math.floor(total / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
}
