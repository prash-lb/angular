import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { User, UserResponse } from '../../interface/User.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  authService = inject(AuthService);
  emailTaken = signal<boolean>(false);
  router = inject(Router);

  form: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    firstName: new FormControl<string | null>('', [Validators.required]),
    lastName: new FormControl<string | null>('', [Validators.required]),
    email: new FormControl<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>('', [Validators.required]),
  });

  onSubmit() {
    const user: User = {
      email: this.form.value.email ? this.form.value.email : '',
      password: this.form.value.password ? this.form.value.password : '',
      firstname: this.form.value.firstName ? this.form.value.firstName : '',
      lastname: this.form.value.lastName ? this.form.value.lastName : '',
    };
    this.authService.postUsers(user).subscribe({
      next: () => {
        this.router.navigateByUrl('connexion');
        this.emailTaken.set(false);
      },
      error: (err: Error) => {
        if (err.message === 'EmailAlreadyTaken') {
          this.emailTaken.set(true);
        }
      },
    });
  }
}
