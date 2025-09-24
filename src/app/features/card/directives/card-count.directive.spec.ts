import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CardCountDirective } from './card-count.directive';

@Component({
  template: '<div [appCardCount]="count">Test</div>',
  standalone: true,
  imports: [CardCountDirective],
})
class TestComponent {
  count = 0;
}

describe('CardCountDirective', () => {
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

    divEl = fixture.debugElement.query(By.directive(CardCountDirective)).nativeElement;
  });

  it('should create an instance', () => {
    expect(divEl).toBeTruthy();
  });

  it('should add red classes when count is 0', () => {
    component.count = 0;
    fixture.detectChanges();

    expect(divEl.classList).toContain('bg-red-100');
    expect(divEl.classList).toContain('text-red-800');
  });

  it('should add green classes when count is not 0', () => {
    component.count = 2;
    fixture.detectChanges();

    expect(divEl.classList).toContain('bg-green-100');
    expect(divEl.classList).toContain('text-green-800');
  });

  it('should remove previous classes on change', () => {
    component.count = 0;
    fixture.detectChanges();

    expect(divEl.classList).toContain('bg-red-100');

    component.count = 1;
    fixture.detectChanges();

    expect(divEl.classList).toContain('bg-green-100');
    expect(divEl.classList).not.toContain('bg-red-100');
  });
});
