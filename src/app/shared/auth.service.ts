import { inject, Injectable, signal } from '@angular/core';
import { User, UserResponse } from '../interface/User.interface';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiJsonServer = 'http://localhost:3000/';
  connecte = signal<boolean>(false);

  public postUsers(user: User) {
    return this.emailAvaible(user.email).pipe(
      switchMap((value) => {
        if (value) {
          return throwError(() => new Error('EmailAlreadyTaken'));
        } else {
          return this.http
            .post<UserResponse[]>(`${this.apiJsonServer}users`, user)
            .pipe(tap(() => this.connecte.set(true)));
        }
      })
    );
  }

  private emailAvaible(email: string) {
    return this.http.get<UserResponse[]>(`${this.apiJsonServer}users`).pipe(
      map((data) => {
        return data.some((value) => value.email === email);
      })
    );
  }

  public connexion(email: string, password: string) {
    return this.http.get<UserResponse[]>(`${this.apiJsonServer}users`).pipe(
      map((data) => {
        const user = data.find(
          (users) => users.email === email && users.password === password
        );
        console.log(user);
        if (!user) {
          throw new Error('Invalid User');
        } else {
          return user;
        }
      })
    );
  }
}
