import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  schemas: [],
})
export class HeaderComponent {
  public auth: AuthService = inject(AuthService);
  public router: Router = inject(Router);

  public deconnexion(): void {
    this.auth.deconnexion();
    this.router.navigateByUrl('');
  }
}
