import { Directive, ElementRef, Input, OnChanges, OnDestroy, inject } from '@angular/core';

/**
 * Animates a numeric value, counting up (or down) from the previously shown
 * number to the new one. Usage: <strong [appCountUp]="candidates().length"></strong>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnChanges, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input('appCountUp') value: number | null | undefined = 0;
  @Input() countUpSuffix = '';
  @Input() countUpDuration = 900;

  private current = 0;
  private raf = 0;

  ngOnChanges(): void {
    const target = Math.round(Number(this.value) || 0);
    const from = this.current;
    if (from === target) {
      this.render(target);
      return;
    }
    this.render(from); // show the starting value immediately (no empty flash)
    cancelAnimationFrame(this.raf);
    const start = performance.now();
    const step = (now: number): void => {
      const t = Math.min(1, (now - start) / this.countUpDuration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      this.render(Math.round(from + (target - from) * eased));
      if (t < 1) {
        this.raf = requestAnimationFrame(step);
      } else {
        this.current = target;
      }
    };
    this.raf = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
  }

  private render(n: number): void {
    this.el.nativeElement.textContent = `${n}${this.countUpSuffix}`;
  }
}
