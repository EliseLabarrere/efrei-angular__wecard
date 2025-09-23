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
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  editProfileForm: FormGroup;
  loading = signal(false);
  error = signal<string>('');
  user!: User;

  constructor() {
    this.editProfileForm = this.fb.group(
      {
        firstname: ['', [Validators.required, Validators.minLength(2)]],
        lastname: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        confirmPassword: [''],
        secretQuestion: ['', [Validators.required, Validators.minLength(2)]],
        secretAnswer: ['', [Validators.required, Validators.minLength(2)]],
        accountWeward: [''],
        accountInstagram: [''],
        accountDiscord: [''],
      },
      { validators: passwordMatchValidator }
    );

    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.loading.set(true);
    this.userService.getMyInfos().subscribe({
      next: user => {
        this.user = user;
        this.editProfileForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          accountWeward: user.accountWeward,
          accountInstagram: user.accountInstagram,
          accountDiscord: user.accountDiscord,
        });
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Impossible de charger le profil');
        this.loading.set(false);
      },
    });
  }

  onSubmit() {
    if (this.editProfileForm.valid) {
      this.loading.set(true);
      const formValues = this.editProfileForm.value;

      const updatedUser: User = {
        ...this.user,
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        email: formValues.email,
        secretQuestion: formValues.secretQuestion,
        secretAnswer: formValues.secretAnswer,
        accountWeward: formValues.accountWeward || undefined,
        accountInstagram: formValues.accountInstagram || undefined,
        accountDiscord: formValues.accountDiscord || undefined,
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          alert('Profil mis à jour !');
          this.loading.set(false);
        },
        error: err => {
          console.error(err);
          this.error.set('Erreur lors de la mise à jour du profil');
          this.loading.set(false);
        },
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.editProfileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.editProfileForm.get(fieldName);

    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['email']) return "Format d'email invalide";
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }

    if (fieldName === 'confirmPassword' && this.editProfileForm.errors?.['passwordMismatch']) {
      return 'Les mots de passe ne correspondent pas';
    }

    return '';
  }
}
