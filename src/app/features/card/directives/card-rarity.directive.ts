import { Directive, ElementRef, Input, OnChanges, Renderer2, inject } from '@angular/core';
import { CardRarity } from '../models/card.model';

type CardRarityStyle = 'background' | 'color';

@Directive({
  selector: '[appCardRarity]',
  standalone: true,
})
export class CardRarityDirective implements OnChanges {
  @Input('appCardRarity') rarity!: CardRarity;
  @Input() styleType: CardRarityStyle = 'background';

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnChanges(): void {
    let color = '';
    let gradient = '';

    switch (this.rarity) {
      case 'COMMON':
        color = '#f39359';
        break;
      case 'RARE':
        color = '#53b2aa';
        break;
      case 'SUPER_RARE':
        color = '#655fe5';
        break;
      case 'LEGENDARY':
        color = '#7a7db2';
        gradient = 'linear-gradient(45deg, #a4c3e2, #7a7db2, #c19cbb)';
        break;
    }

    if (this.styleType === 'color') {
      this.renderer.setStyle(this.el.nativeElement, 'color', color || '#ffffff');
    } else {
      if (gradient) {
        this.renderer.setStyle(this.el.nativeElement, 'background', gradient);
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
      }
    }
  }
}
