import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Voyage } from '../interface/Voyage.interface';
import { Observable, of } from 'rxjs';
import * as hash from 'object-hash';
import { Billet } from '../interface/Billet.interface';
import { LocalService } from './local.service';
@Injectable({
  providedIn: 'root',
})
export class BilletsService {
  private http: HttpClient = inject(HttpClient);
  private localService: LocalService = inject(LocalService);
  private apiJsonServer: string = 'http://localhost:3000/';

  public postBillet(voyage: Voyage, idUser: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiJsonServer}billets`, {
      id: hash.sha1(voyage),
      idUser,
      voyage,
    });
  }

  public getBillet(): Observable<Billet[]> {
    const idUser = this.localService.getData('id') ?? null;
    if (!idUser) {
      return of([]);
    } else {
      return this.http.get<Billet[]>(
        `${this.apiJsonServer}billets?idUser=${idUser}`
      );
    }
  }
  public deleteBillet(billetId: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiJsonServer}billets/${billetId}`
    );
  }
}
