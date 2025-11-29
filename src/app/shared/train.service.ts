import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiResponseGetPlace,
  PlaceResult,
  Place,
  ApiResponseJourneys,
  Journey,
} from '../interface/Place.interface';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private http: HttpClient = inject(HttpClient);
  private url: string = 'https://api.sncf.com/v1/';

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
          if (!PlaceResult) {
            return [];
          }
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

  public getJourneys(
    originId: string,
    destinationId: string,
    date?: string
  ): Observable<Journey[]> {
    const httpHeader = new HttpHeaders({
      Authorization: 'Basic ' + btoa(environment.sncfApiKey),
    });

    let url = `${this.url}coverage/sncf/journeys?from=${originId}&to=${destinationId}&datetime_represents=departure&count=12`;
    if (date) {
      url += `&datetime=${date}`;
    }
    return this.http
      .get<ApiResponseJourneys>(url, { headers: httpHeader })
      .pipe(
        map((data) => {
          return data.journeys.map((journey) => {
            return {
              id: journey.id,
              origin: originId,
              destination: destinationId,
              departureTime: this.formatTime(journey.departure_date_time),
              arrivalTime: this.formatTime(journey.arrival_date_time),
              duration: journey.duration,
              sections: journey.sections,
            };
          });
        })
      );
  }

  private formatTime(dateTimeStr: string): string {
    if (!dateTimeStr || dateTimeStr.length < 15) return '';
    const hours = dateTimeStr.substring(9, 11);
    const minutes = dateTimeStr.substring(11, 13);
    return `${hours}:${minutes}`;
  }
}
