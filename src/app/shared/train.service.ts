import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Horaire } from '../interface/Horaire.interface';
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

  public getJourneys(
  originId: string,
  destinationId: string,
  date?: string // Paramètre optionnel pour la date
): Observable<Journey[]> {
  const httpHeader = new HttpHeaders({
    Authorization: 'Basic ' + btoa(environment.sncfApiKey),
  });

  // Construction de l'URL avec la date si elle est fournie
  let url = `${this.url}coverage/sncf/journeys?from=${originId}&to=${destinationId}&datetime_represents=departure`;
  if (date) {
    url += `&datetime=${date}`;
  }

  return this.http
    .get<ApiResponseJourneys>(url, { headers: httpHeader })
    .pipe(
      map((data) => {
        // Retourne tous les itinéraires (ou une limite si tu préfères)
        return data.journeys.map((journey) => {
          const departure = journey.departure_date_time;
          const arrival = journey.arrival_date_time;
          return {
            id: journey.id,
            origin: originId,
            destination: destinationId,
            departureTime: this.formatTime(departure),
            arrivalTime: this.formatTime(arrival),
            duration: journey.duration,
            sections: journey.sections,
          };
        });
      })
    );
}


  private formatTime(dateTimeStr: string): string {
    // Format YYYYMMDDTHHMMSS => HHhMM
    if (!dateTimeStr || dateTimeStr.length < 15) return '';
    const hours = dateTimeStr.substring(9, 11);
    const minutes = dateTimeStr.substring(11, 13);
    return `${hours}h${minutes}`;
  }

  public getTrainHoraires(horaireFrom: Horaire, horaireTo: Horaire) {}
}
