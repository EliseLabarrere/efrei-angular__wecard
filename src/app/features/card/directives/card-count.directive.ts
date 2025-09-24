import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appCardCount]',
  standalone: true,
})
export class CardCountDirective implements OnChanges {
  @Input('appCardCount') count!: number;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnChanges(): void {
    const classesToRemove = [
      'bg-green-100',
      'text-green-800',
      'dark:bg-green-900',
      'dark:text-green-200',
      'bg-red-100',
      'text-red-800',
      'dark:bg-red-900',
      'dark:text-red-200',
    ];
    classesToRemove.forEach(c => this.renderer.removeClass(this.el.nativeElement, c));

    if (this.count !== 0) {
      ['bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-200'].forEach(c =>
        this.renderer.addClass(this.el.nativeElement, c)
      );
    } else {
      ['bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-200'].forEach(c =>
        this.renderer.addClass(this.el.nativeElement, c)
      );
    }
  }
}
