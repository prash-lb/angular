import { inject, Injectable, signal } from '@angular/core';
import { User, UserResponse } from '../interface/User.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, tap, throwError } from 'rxjs';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private local = inject(LocalService);
  private apiJsonServer = 'http://localhost:3000/';
  public connecte = signal<boolean>(false);

  public postUsers(user: User): Observable<UserResponse[]> {
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

  public deleteUser(id: string) {
    return this.http.delete<boolean>(`${this.apiJsonServer}users/${id}`);
  }
  public patchUser(user: UserResponse): Observable<UserResponse> {
    const userPatch: Partial<UserResponse> = {
      id: user.id,
    };
    if (user.firstname) {
      userPatch.firstname = user.firstname;
      this.local.saveData('firstname', user.firstname);
    }
    if (user.lastname) {
      userPatch.lastname = user.lastname;
      this.local.saveData('lastname', user.lastname);
    }
    if (user.email) {
      userPatch.email = user.email;
      this.local.saveData('email', user.email);
    }
    if (user.password) {
      userPatch.password = user.password;
    }
    return this.http.patch<UserResponse>(
      `${this.apiJsonServer}users/${user.id}`,
      userPatch
    );
  }

  private emailAvaible(email: string): Observable<boolean> {
    return this.http.get<UserResponse[]>(`${this.apiJsonServer}users`).pipe(
      map((data) => {
        return data.some((value) => value.email === email);
      })
    );
  }

  public connexion(email: string, password: string): Observable<UserResponse> {
    return this.http.get<UserResponse[]>(`${this.apiJsonServer}users`).pipe(
      map((data) => {
        const user = data.find(
          (users) => users.email === email && users.password === password
        );
        if (!user) {
          throw new Error('Invalid User');
        } else {
          this.local.saveData('firstname', user.firstname);
          this.local.saveData('lastname', user.lastname);
          this.local.saveData('email', user.email);
          this.local.saveData('id', user.id);
          this.connecte.set(true);
          return user;
        }
      })
    );
  }

  public deconnexion(): void {
    this.local.clearData();
    this.connecte.set(false);
  }
}
