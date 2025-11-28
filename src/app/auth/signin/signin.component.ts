import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../interface/User.interface';
import { Router, RouterLink } from '@angular/router';
import { LocalService } from '../../shared/local.service';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  public authService: AuthService = inject(AuthService);
  public emailTaken: WritableSignal<boolean> = signal<boolean>(false);
  public router: Router = inject(Router);

  public form: FormGroup<{
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
  public local = inject(LocalService);

  public onSubmit(): void {
    const user: User = {
      email: this.form.value.email ? this.form.value.email : '',
      password: this.form.value.password ? this.form.value.password : '',
      firstname: this.form.value.firstName ? this.form.value.firstName : '',
      lastname: this.form.value.lastName ? this.form.value.lastName : '',
    };
    this.authService.postUsers(user).subscribe({
      next: () => {
        if (this.local.getData('payload')) {
          this.router.navigateByUrl('reservation');
        } else {
          this.router.navigateByUrl('connexion');
        }
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
