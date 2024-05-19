import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  constructor(private el: ElementRef) {};
  @Input() info: string | number = "";
  private tooltip?: HTMLElement;
  private timeoutID: any = undefined; // Handling DOM manipulations with timeouts for optimization.

  @HostListener("mouseenter") onMouseEnter() {
    if (!this.tooltip && this.info) {
      this.timeoutID = setTimeout(() => this.show(), 200); // Setting timeoutID before show() triggers.
    }
  }

  @HostListener("mouseleave") onMouseLeave() {
    if (this.timeoutID) {
      this.timeoutID = clearTimeout(this.timeoutID); // Clearing timeoutID and preventing show() to trigger, if leaving happens too quick.
    }
    if (this.tooltip) {
      this.hide();
    }
  }

  show(): void {
    // DOM manipulation is prevented via this condition, in case if timeoutID is cleared via mouseleave event.
    if (this.timeoutID) {
      this.create();
      this.setPosition();
      this.tooltip?.classList.add("hc-tooltip-show");
    }
  }

  hide(): void {
    // hide doesn't need to clear timeoutID as it already happens with mouseleave listener.
    this.tooltip?.classList.remove("hc-tooltip-show");
    this.tooltip?.remove();
    this.tooltip = undefined;
  }

  create(): void {
    this.tooltip = document.createElement("span");
    this.tooltip.classList.add("hc-tooltip");
    this.tooltip.textContent = `${this.info}`;
    document.body.appendChild(this.tooltip);
  }

  setPosition(): void {
    const elementRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltip?.getBoundingClientRect();
    if (!tooltipRect) return
    if (this.tooltip) {
      this.tooltip.style.top = `${elementRect.top - tooltipRect?.height - 2}px`;
      this.tooltip.style.left = `${elementRect.left + (elementRect.width - tooltipRect.width) / 2}px`;
    }
  }
}
