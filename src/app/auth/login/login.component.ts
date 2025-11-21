import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  loginFailed = signal<boolean>(false);
  form: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    email: new FormControl<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>('', [Validators.required]),
  });

  onSubmit() {
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    this.authService.connexion(email, password).subscribe({
      next: () => {
        console.log('connecté');
        this.loginFailed.set(false);
      },
      error: (err: Error) => {
        if (err.message === 'Invalid User') {
          this.loginFailed.set(true);
        }
      },
    });
  }
}
