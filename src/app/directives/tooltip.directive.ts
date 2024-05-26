import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {
  constructor(
    private el: ElementRef,
    private router: Router
  ) {};
  label = input<any>("");
  info = input<any>("");
  private tooltip?: HTMLElement;
  private timeoutID: any = undefined; // Handling DOM manipulations with timeouts for optimization.

  private subscriptions: Subscription[] = [];
  dispose() {this.subscriptions.forEach(subscription => subscription.unsubscribe())};

  @HostListener("mouseenter")
  @HostListener("focus")
  initiate() {
    if (!this.tooltip && this.info()) {
      this.timeoutID = setTimeout(() => this.show(), 200); // Setting timeoutID before show() triggers.
    }
  }

  @HostListener("mouseleave") 
  @HostListener("blur")
  dismiss() {
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
    this.dispose();
  }

  create(): void {
    this.tooltip = document.createElement("span");
    this.tooltip.classList.add("hc-tooltip");
    if (this.label()) {
      const label = document.createElement("div");
      label.classList.add("hc-tooltip-label");
      label.textContent = `${this.label()}`;
      this.tooltip.appendChild(label);
      
    }
    const info = document.createElement("div");
    info.textContent = `${this.info()}`;
    this.tooltip.appendChild(info);
    document.body.appendChild(this.tooltip);
    const subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.hide();
      };
    });
    this.subscriptions.push(subscription)
  }

  setPosition(): void {
    const elementRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltip?.getBoundingClientRect();
    if (!tooltipRect) return
    if (this.tooltip) {
      this.tooltip.style.top = `${elementRect.top - tooltipRect?.height - 6}px`;
      this.tooltip.style.left = `${elementRect.left + (elementRect.width - tooltipRect.width) / 2}px`;
    }
  }
}
