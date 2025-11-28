import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Voyage } from '../interface/Voyage.interface';
import { Observable } from 'rxjs';
import * as hash from 'object-hash';
@Injectable({
  providedIn: 'root',
})
export class BilletsService {
  private http = inject(HttpClient);
  private apiJsonServer = 'http://localhost:3000/';

  private generationid(voyage: Voyage) {
    hash.sha1(voyage);
  }

  public postBillet(voyage: Voyage, id: string): Observable<boolean> {
    console.log('dans', voyage, id);
    const voyageId = {
      idVoyage: hash.sha1(voyage),
      ...voyage,
    };
    return this.http.post<boolean>(`${this.apiJsonServer}billets`, {
      idUser: id,
      voyageId,
    });
  }
}
