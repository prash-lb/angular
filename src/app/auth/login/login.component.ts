import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public authService: AuthService = inject(AuthService);
  public loginFailed: WritableSignal<boolean> = signal<boolean>(false);
  public router: Router = inject(Router);
  public form: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    email: new FormControl<string | null>('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>('', [Validators.required]),
  });

  public onSubmit(): void {
    const email = this.form.value.email ?? '';
    const password = this.form.value.password ?? '';
    this.authService.connexion(email, password).subscribe({
      next: () => {
        this.router.navigateByUrl('');
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
