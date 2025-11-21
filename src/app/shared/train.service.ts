import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Horaire } from '../interface/Horaire.interface';
import {
  ApiResponseGetPlace,
  PlaceResult,
  Place,
} from '../interface/Place.interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private http = inject(HttpClient);
  url = 'https://api.sncf.com/v1/';

  public autoCompletionPlace(place: string): Observable<Place[]> {
    const httpHeader = new HttpHeaders({
      Authorization: 'Basic ' + btoa(environment.sncfApiKey),
    });
    return this.http
      .get<ApiResponseGetPlace>(`${this.url}coverage/sncf/places?q=${place}`, {
        headers: httpHeader,
      })
      .pipe(
        map((data) => {
          const PlaceResult: PlaceResult[] = data.places;
          let placeList: Place[] = [];
          PlaceResult.map((places) => {
            if (places.embedded_type === 'stop_area') {
              const newPlace: Place = {
                id: places?.id || '',
                name: places.stop_area?.label || '',
              };
              placeList = [...placeList, newPlace];
            }
          });
          return placeList;
        })
      );
  }

  public getTrainHoraires(horaireFrom: Horaire, horaireTo: Horaire) {}
}
