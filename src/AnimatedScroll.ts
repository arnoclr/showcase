import CubicBezier from "@thednp/bezier-easing";

interface ObservedElement {
  fromHeightPx: number;
  toHeightPx: number;
  element: HTMLElement;
}

export class AnimatedScroll {
  private _elements: ObservedElement[] = [];
  private _animationFrameId: number | null = null;

  public constructor() {
    const elements = document.querySelectorAll<HTMLElement>("[data-scroll");

    for (const element of elements) {
      const fromHeightVh = element.dataset.scrollFromHeightVh;
      const toHeightVh = element.dataset.scrollToHeightVh;

      if (fromHeightVh === undefined || toHeightVh === undefined) {
        console.error(
          "Missing data-scroll-from-height-vh or data-scroll-to-height-vh attribute"
        );
        continue;
      }

      this._elements.push({
        fromHeightPx: (parseInt(fromHeightVh) * window.innerHeight) / 100,
        toHeightPx: (parseInt(toHeightVh) * window.innerHeight) / 100,
        element,
      });
    }

    window.addEventListener("scroll", () => {
      if (this._animationFrameId === null) {
        this._animationFrameId = requestAnimationFrame(() => {
          this.updateProgress();
          this._animationFrameId = null;
        });
      }
    });

    this.updateProgress();
  }

  private updateProgress() {
    const scrollY = window.scrollY;

    for (const element of this._elements) {
      const progress =
        (scrollY - element.fromHeightPx) /
        (element.toHeightPx - element.fromHeightPx);

      if (progress >= 0 && progress <= 1) {
        this.updateElementProgress(element, progress);
      }
    }
  }

  private updateElementProgress(
    element: ObservedElement,
    linearProgress: number
  ) {
    const beziers = element.element.dataset.scrollBezier;

    const entries =
      beziers === undefined ? [null].entries() : beziers.split(";").entries();

    for (const [i, bezier] of entries) {
      const bezierArray =
        bezier === null
          ? [0.07, 0.55, 0.67, 0.42]
          : bezier.split(",").map(Number);

      const progress = this.cubicBezier(
        bezierArray[0],
        bezierArray[1],
        bezierArray[2],
        bezierArray[3],
        linearProgress
      );

      const cssVarName = i == 0 ? "--progress" : `--progress-${i}`;

      element.element.style.setProperty(cssVarName, progress.toString());
    }
  }

  private cubicBezier(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    at: number
  ): number {
    const cubic = new CubicBezier(x1, y1, x2, y2) as unknown as (
      x: number
    ) => number;
    return cubic(at);
  }
}
