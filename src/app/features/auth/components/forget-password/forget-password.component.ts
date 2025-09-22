import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../shared/services/api.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  forgetPasswordForm: FormGroup;
  loading = signal(false);
  error = signal<string>('');
  secretQuestion = signal<string | null>(null);

  constructor() {
    this.forgetPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        secretAnswer: ['', []],
        password: ['', []],
        confirmPassword: ['', []],
      },
      { validators: passwordMatchValidator }
    );
  }

  /**
   * Étape 1 : récupérer la question secrète
   */
  fetchSecretQuestion() {
    const email = this.forgetPasswordForm.get('email')?.value;
    if (!email) return;

    this.loading.set(true);
    this.error.set('');

    this.api
      .post<{ success: boolean; question: string }>('auth/secret-question', { email })
      .subscribe({
        next: res => {
          this.loading.set(false);
          this.secretQuestion.set(res.question);

          this.forgetPasswordForm
            .get('secretAnswer')
            ?.setValidators([Validators.required, Validators.minLength(2)]);
          this.forgetPasswordForm
            .get('password')
            ?.setValidators([Validators.required, Validators.minLength(6)]);
          this.forgetPasswordForm.get('confirmPassword')?.setValidators([Validators.required]);

          this.forgetPasswordForm.get('secretAnswer')?.updateValueAndValidity();
          this.forgetPasswordForm.get('password')?.updateValueAndValidity();
          this.forgetPasswordForm.get('confirmPassword')?.updateValueAndValidity();
        },
        error: err => {
          this.loading.set(false);
          this.error.set(
            err.error?.message || err.message || 'Impossible de récupérer la question secrète'
          );
        },
      });
  }

  /**
   * Étape 2 : soumettre la réponse + mot de passe
   */
  onSubmit() {
    if (this.secretQuestion() === null) {
      this.fetchSecretQuestion();
      return;
    }

    if (this.forgetPasswordForm.valid) {
      this.loading.set(true);
      this.error.set('');

      const { email, secretAnswer, password, confirmPassword } = this.forgetPasswordForm.value;

      this.api
        .post('user/reset-password-by-secret-question', {
          email,
          answer: secretAnswer,
          password,
          confirmPassword,
        })
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/auth/login']);
          },
          error: err => {
            this.loading.set(false);
            this.error.set(
              err.error?.message || err.message || 'Erreur lors du changement de mot de passe'
            );
          },
        });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.forgetPasswordForm.get(fieldName);

    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return "Format d'email invalide";
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }

    if (fieldName === 'confirmPassword' && this.forgetPasswordForm.errors?.['passwordMismatch']) {
      return 'Les mots de passe ne correspondent pas';
    }

    return '';
  }
}
