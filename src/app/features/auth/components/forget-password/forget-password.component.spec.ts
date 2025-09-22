import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ForgetPasswordComponent } from './forget-password.component';
import { ApiService } from '../../../../shared/services/api.service';

class MockApiService {
  post = jasmine.createSpy('post');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let apiService: MockApiService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ForgetPasswordComponent],
      providers: [
        FormBuilder,
        { provide: ApiService, useClass: MockApiService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as unknown as MockApiService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait invalider le formulaire si email vide', () => {
    component.forgetPasswordForm.get('email')?.setValue('');
    component.forgetPasswordForm.get('email')?.markAsTouched();
    expect(component.isFieldInvalid('email')).toBeTrue();
    expect(component.getFieldError('email')).toBe('Ce champ est requis');
  });

  it('devrait retourner un message si email invalide', () => {
    component.forgetPasswordForm.get('email')?.setValue('not-an-email');
    component.forgetPasswordForm.get('email')?.markAsTouched();
    expect(component.getFieldError('email')).toBe("Format d'email invalide");
  });

  it('devrait récupérer la question secrète', fakeAsync(() => {
    const questionResponse = { success: true, question: 'Nom de ton chien ?' };
    apiService.post.and.returnValue(of(questionResponse));

    component.forgetPasswordForm.get('email')?.setValue('test@test.com');
    component.fetchSecretQuestion();
    tick();

    expect(component.secretQuestion()).toBe('Nom de ton chien ?');
    expect(component.forgetPasswordForm.get('secretAnswer')?.validator).toBeDefined();
    expect(component.forgetPasswordForm.get('password')?.validator).toBeDefined();
    expect(component.forgetPasswordForm.get('confirmPassword')?.validator).toBeDefined();
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  }));

  it('devrait gérer une erreur lors de la récupération de la question secrète', fakeAsync(() => {
    apiService.post.and.returnValue(throwError(() => ({ error: { message: 'Erreur serveur' } })));

    component.forgetPasswordForm.get('email')?.setValue('test@test.com');
    component.fetchSecretQuestion();
    tick();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Erreur serveur');
  }));

  it('devrait soumettre le mot de passe si la question secrète est récupérée', fakeAsync(() => {
    component.secretQuestion.set('Nom de ton chien ?');
    component.forgetPasswordForm.setValue({
      email: 'test@test.com',
      secretAnswer: 'Rex',
      password: '123456',
      confirmPassword: '123456',
    });

    apiService.post.and.returnValue(of({ success: true }));

    component.onSubmit();
    tick();

    expect(apiService.post).toHaveBeenCalledWith('user/reset-password-by-secret-question', {
      email: 'test@test.com',
      answer: 'Rex',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  }));

  it('devrait gérer une erreur lors de la soumission du mot de passe', fakeAsync(() => {
    component.secretQuestion.set('Nom de ton chien ?');
    component.forgetPasswordForm.setValue({
      email: 'test@test.com',
      secretAnswer: 'Rex',
      password: '123456',
      confirmPassword: '123456',
    });

    apiService.post.and.returnValue(throwError(() => ({ error: { message: 'Erreur serveur' } })));

    component.onSubmit();
    tick();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Erreur serveur');
  }));

  it('devrait détecter un mismatch de mot de passe', () => {
    component.secretQuestion.set('Nom de ton chien ?');
    component.forgetPasswordForm.patchValue({ password: '123456', confirmPassword: '654321' });
    expect(component.forgetPasswordForm.errors?.['passwordMismatch']).toBeTrue();
    expect(component.getFieldError('confirmPassword')).toBe(
      'Les mots de passe ne correspondent pas'
    );
  });
});
