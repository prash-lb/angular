import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { AuthService } from '../shared/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocalService } from '../shared/local.service';
import { UserResponse } from '../interface/User.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  public userForm: FormGroup<{
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = new FormGroup({
    firstName: new FormControl<string | null>(''),
    lastName: new FormControl<string | null>(''),
    email: new FormControl<string | null>('', [Validators.email]),
    password: new FormControl<string | null>(''),
  });

  public connecte: boolean = false;
  public auth: AuthService = inject(AuthService);
  public local: LocalService = inject(LocalService);
  public edition: WritableSignal<boolean> = signal<boolean>(false);
  public firstName: string | null = '';
  public lastName: string | null = '';
  public email: string | null = '';
  public success: 'success' | 'fail' | '' = '';
  public router: Router = inject(Router);

  private getLocale(): void {
    this.firstName = this.local.getData('firstname');
    this.lastName = this.local.getData('lastname');
    this.email = this.local.getData('email');
  }

  ngOnInit(): void {
    this.getLocale();
  }

  public editMode(): void {
    this.edition.set(!this.edition());
  }

  public delete(): void {
    const id = this.local.getData('id') ?? '';
    this.auth.deleteUser(id).subscribe({
      next: (value) => {
        if (value) {
          this.auth.deconnexion();
          this.router.navigateByUrl('/');
        }
      },
    });
  }

  public onSubmit(): void {
    const user: UserResponse = {
      firstname: this.userForm.value.firstName ?? '',
      lastname: this.userForm.value.lastName ?? '',
      email: this.userForm.value.email ?? '',
      password: this.userForm.value.password ?? '',
      id: this.local.getData('id') ?? '',
    };
    this.auth.patchUser(user).subscribe({
      next: () => {
        this.success = 'success';
        this.edition.set(!this.edition());
        this.getLocale();
      },
      error: () => {
        this.success = 'fail';
        this.edition.set(!this.edition());
      },
    });
  }

  public get updateError() {
    return this.success === 'fail';
  }

  public get updateSuccess() {
    return this.success === 'success';
  }
}
