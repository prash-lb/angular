import { Injectable, signal } from '@angular/core';
import { Place } from '../interface/Place.interface';

@Injectable({
  providedIn: 'root',
})
export class ItineraryService {
  originPlace = signal<Place | null>(null);
  destinationPlace = signal<Place | null>(null);

  setItinerary(origin: Place, destination: Place) {
    this.originPlace.set(origin);
    this.destinationPlace.set(destination);
  }

  clearItinerary() {
    this.originPlace.set(null);
    this.destinationPlace.set(null);
  }

  getItinerary() {
    return {
      origin: this.originPlace(),
      destination: this.destinationPlace(),
    };
  }
}
