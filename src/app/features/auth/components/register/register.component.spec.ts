import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { RegisterPayload } from '../../models/user.model';

class MockAuthService {
  register = jasmine.createSpy('register').and.returnValue(of(undefined));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait invalider le formulaire si requis manquant', () => {
    component.registerForm.setValue({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      secretQuestion: '',
      secretAnswer: '',
      accountWeward: '',
      accountInstagram: '',
      accountDiscord: '',
    });
    expect(component.registerForm.valid).toBeFalse();
  });

  it('devrait détecter un mismatch de mot de passe', () => {
    component.registerForm.patchValue({
      password: '123456',
      confirmPassword: '654321',
    });
    expect(component.registerForm.errors?.['passwordMismatch']).toBeTrue();
    expect(component.getFieldError('confirmPassword')).toBe(
      'Les mots de passe ne correspondent pas'
    );
  });

  it('devrait retourner un message si champ requis vide', () => {
    const control = component.registerForm.get('firstname');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.getFieldError('firstname')).toBe('Ce champ est requis');
  });

  it('devrait retourner un message si email invalide', () => {
    const control = component.registerForm.get('email');
    control?.setValue('not-an-email');
    control?.markAsTouched();
    expect(component.getFieldError('email')).toBe("Format d'email invalide");
  });

  it('devrait appeler AuthService.register et Router.navigate en cas de succès', () => {
    const payload: RegisterPayload = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
      secretQuestion: 'Nom de ton chien ?',
      secretAnswer: 'Rex',
      accountWeward: 'weward123',
      accountInstagram: 'insta123',
      accountDiscord: 'discord123',
    };

    component.registerForm.setValue(payload);

    component.onSubmit();

    expect(authService.register).toHaveBeenCalledWith(payload);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('devrait gérer une erreur renvoyée par AuthService.register', () => {
    authService.register.and.returnValue(throwError(() => new Error('Erreur serveur')));

    const payload: RegisterPayload = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456',
      secretQuestion: 'Nom de ton chien ?',
      secretAnswer: 'Rex',
      accountWeward: '',
      accountInstagram: '',
      accountDiscord: '',
    };

    component.registerForm.setValue(payload);

    component.onSubmit();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Erreur serveur');
  });
});
