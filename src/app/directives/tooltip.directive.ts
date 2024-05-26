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
  private focalPoint?: HTMLElement;
  private tooltip?: HTMLElement;
  private timeoutID: any = undefined; // Handling DOM manipulations with timeouts for optimization.

  private subscriptions: Subscription[] = [];
  dispose() { this.subscriptions.forEach(subscription => subscription.unsubscribe()) };

  @HostListener("mouseenter")
  @HostListener("focus")
  initiate() {
    if (!this.focalPoint && this.info()) {
      this.timeoutID = setTimeout(() => this.show(), 200); // Setting timeoutID before show() triggers.
    }
  }

  @HostListener("mouseleave") 
  @HostListener("blur")
  dismiss() {
    if (this.timeoutID) {
      this.timeoutID = clearTimeout(this.timeoutID); // Clearing timeoutID and preventing show() to trigger, if leaving happens too quick.
    }
    if (this.focalPoint) {
      this.hide();
    }
  }
  
  show(): void {
    // DOM manipulation is prevented via this condition, in case if timeoutID is cleared via mouseleave event.
    if (this.timeoutID) {
      this.create();
      this.setPosition();
    }
  }

  hide(): void {
    // hide doesn't need to clear timeoutID as it already happens with mouseleave listener.
    this.focalPoint?.remove();
    this.focalPoint = undefined;
    this.dispose();
  }

  create(): void {
    this.focalPoint = document.createElement("div");
    this.focalPoint.style.position = "relative";
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
    this.focalPoint.appendChild(this.tooltip);
    this.el.nativeElement.appendChild(this.focalPoint);
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
      //Horizontal
      const leftVal = elementRect.left + (elementRect.width - tooltipRect.width) / 2;
      const rightVal = elementRect.right - (elementRect.width - tooltipRect.width) / 2;
      const rightEdge = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      if (rightVal > rightEdge) {
        //Avoiding to place tooltip out of right edge of the viewport
        this.tooltip.style.right = `${elementRect.width / 2}px`;
      }
      else if (leftVal < 0) {
        //Avoiding to place tooltip out of left edge of the viewport
        this.tooltip.style.left = `${elementRect.width / 2}px`;
      }
      else {
        this.tooltip.style.left = "50%";
        this.tooltip.style.transform = "translateX(-50%)";
      }
      //Vertical
      const topVal = elementRect.top - tooltipRect.height;
      if (topVal < 0) {
        //Avoiding to place tooltip out of top edge of the viewport
        this.tooltip.style.top = `${elementRect.height + 6}px`;
      }
      else {
        this.tooltip.style.bottom = "6px"
      }
    }
  }
}
