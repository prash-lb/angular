import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import {
  Calendar,
  LogIn,
  LogOut,
  LucideAngularModule,
  Ticket,
  Train,
  User,
} from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [],
})
export class HeaderComponent {
  public auth: AuthService = inject(AuthService);
  public router: Router = inject(Router);

  readonly Train = Train;
  readonly User = User;
  readonly Ticket = Ticket;
  readonly Calendar = Calendar;
  readonly LogOut = LogOut;
  readonly LogIn = LogIn;

  public deconnexion(): void {
    this.auth.deconnexion();
    this.router.navigateByUrl('');
  }
}
