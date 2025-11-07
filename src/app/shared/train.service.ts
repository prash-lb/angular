import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Horaire } from '../interface/Horaire.interface';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private http = inject(HttpClient);
  url = 'https://api.sncf.com/v1/';

  public autoCompletionPlace(place: string) {
    return this.http.get(`${this.url}coverage/sncf/places?q=${place}`);
  }

  public getTrainHoraires(horaireFrom: Horaire, horaireTo: Horaire) {}
}
