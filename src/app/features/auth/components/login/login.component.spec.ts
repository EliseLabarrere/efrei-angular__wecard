import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthService {
  login = jasmine.createSpy('login').and.returnValue(of(undefined));
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, RouterTestingModule],
      providers: [FormBuilder, { provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire avec email et password vides', () => {
    expect(component.loginForm.value).toEqual({ email: '', password: '' });
  });

  it('devrait invalider le formulaire si email est vide', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();
    expect(component.isFieldInvalid('email')).toBeFalse(); // pas touché
    emailControl?.markAsTouched();
    expect(component.isFieldInvalid('email')).toBeTrue();
  });

  it('devrait retourner un message si email invalide', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    expect(component.getFieldError('email')).toBe("Format d'email invalide");
  });

  it('devrait retourner un message si password trop court', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    passwordControl?.markAsTouched();
    expect(component.getFieldError('password')).toContain('Minimum');
  });

  it('devrait appeler AuthService.login et Router.navigate en cas de succès', () => {
    component.loginForm.setValue({ email: 'test@test.com', password: '123456' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('devrait gérer une erreur renvoyée par AuthService.login', () => {
    authService.login.and.returnValue(throwError(() => ({ error: { message: 'Erreur serveur' } })));

    component.loginForm.setValue({ email: 'test@test.com', password: '123456' });
    component.onSubmit();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Erreur serveur');
  });
});
