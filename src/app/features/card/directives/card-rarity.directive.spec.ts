import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardRarityDirective } from './card-rarity.directive';
import { CardRarity } from '../models/card.model';

@Component({
  template: '<div [appCardRarity]="rarity" [styleType]="styleType">Test</div>',
  standalone: true,
  imports: [CardRarityDirective],
})
class TestComponent {
  rarity: CardRarity = 'COMMON';
  styleType: 'background' | 'color' = 'background';
}

describe('CardRarityDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let divEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    divEl = fixture.debugElement.query(By.directive(CardRarityDirective)).nativeElement;
  });

  it('should create an instance', () => {
    expect(divEl).toBeTruthy();
  });

  it('should apply correct background color for COMMON', () => {
    component.rarity = 'COMMON';
    component.styleType = 'background';
    fixture.detectChanges();
    expect(divEl.style.backgroundColor).toBe('rgb(243, 147, 89)');
  });

  it('should apply correct background color for RARE', () => {
    component.rarity = 'RARE';
    fixture.detectChanges();
    expect(divEl.style.backgroundColor).toBe('rgb(83, 178, 170)');
  });

  it('should apply gradient background for LEGENDARY', () => {
    component.rarity = 'LEGENDARY';
    fixture.detectChanges();
    expect(divEl.style.background).toContain('linear-gradient');
  });

  it('should apply color style if styleType="color"', () => {
    component.rarity = 'SUPER_RARE';
    component.styleType = 'color';
    fixture.detectChanges();
    expect(divEl.style.color).toBe('rgb(101, 95, 229)');
  });
});
