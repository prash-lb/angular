import { Component, inject, OnInit } from '@angular/core';
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
  auth = inject(AuthService);
  router = inject(Router);

  deconnexion() {
    this.auth.deconnexion();
    this.router.navigateByUrl('');
  }
}
