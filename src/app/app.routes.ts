import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './auth.guard';
import { BilletsComponent } from './billets/billets.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'connexion',
    component: LoginComponent,
  },
  {
    path: 'inscription',
    component: SigninComponent,
  },
  {
    path: 'reservation',
    component: ReservationComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'billet',
    component: BilletsComponent,
    canActivate: [AuthGuard],
  },
];
