import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  @Input() info: string | number = "";
  tooltip?: HTMLElement;
  constructor(private el: ElementRef) {}
  @HostListener("mouseenter") onMouseEnter() {
    if (!this.tooltip && this.info) {
      this.show();
    }
  }
  @HostListener("mouseleave") onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }
  show() {
    this.create();
    this.setPosition();
    this.tooltip?.classList.add("hc-tooltip-show");
  }

  hide() {
    this.tooltip?.classList.remove("hc-tooltip-show");
    this.tooltip?.remove();
    this.tooltip = undefined;
  }
  create() {
    this.tooltip = document.createElement("span");
    this.tooltip.classList.add("hc-tooltip");
    this.tooltip.textContent = `${this.info}`;
    document.body.appendChild(this.tooltip);
  }
  setPosition() {
    const elementRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltip?.getBoundingClientRect();
    if (!tooltipRect) return
    if (this.tooltip) {
      this.tooltip.style.top = `${elementRect.top - tooltipRect?.height - 2}px`;
      this.tooltip.style.left = `${elementRect.left + (elementRect.width - tooltipRect.width) / 2}px`;
    }
  }
}
