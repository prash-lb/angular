import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../design-system/card/card';
import { Modal } from '../design-system/modal/modal';
import { Timeline, TimelineStop } from '../timeline/timeline';
import { Place } from '../interface/Place.interface';
import { TrainService } from '../shared/train.service';
import { ItineraryService } from '../shared/itinerary.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, Card, Modal, Timeline],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private trainService = inject(TrainService);
  private itineraryService = inject(ItineraryService);
  selectedDate = signal<string>('');

  public placeArrival = signal<Place | undefined>(undefined);
  public placeDepart = signal<Place | undefined>(undefined);
  public date = signal<string>('');
  public nbPassager = signal<number>(1);
  trips = signal<
    {
      origin: string;
      destination: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
    }[]
  >([]);

  modalOpen = false;
  selectedTrip: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
  } | null = null;
  stops: TimelineStop[] = [];
  duration = '3h20';

  ngOnInit(): void {
    this.placeArrival.set(
      JSON.parse(this.activatedRoute.snapshot.paramMap.get('arrive') ?? '') ??
        undefined
    );
    this.placeDepart.set(
      JSON.parse(this.activatedRoute.snapshot.paramMap.get('depart') ?? '') ??
        undefined
    );
    this.date.set(
      this.activatedRoute.snapshot.paramMap.get('dateDepart') ?? ''
    );
    this.nbPassager.set(
      parseInt(
        this.activatedRoute.snapshot.paramMap.get('nombreVoyageur') ?? '1'
      )
    );

    const o = this.placeDepart();
    const d = this.placeArrival();
    const date = this.selectedDate();
    console.log(this.date());
    if (!o || !d) {
      this.trips.set([]);
      return;
    }

    this.trainService.getJourneys(o.id, d.id, date).subscribe((journeys) => {
      this.trips.set(
        journeys.map((j) => ({
          origin: o.name,
          destination: d.name,
          departureTime: j.departureTime,
          arrivalTime: j.arrivalTime,
          duration: this.calculateDuration(j.departureTime, j.arrivalTime),
        }))
      );
    });

    // Lire depuis le service ItineraryService en priorité
    const originFromService = this.itineraryService.originPlace();
    const destinationFromService = this.itineraryService.destinationPlace();

    if (originFromService) this.placeDepart.set(originFromService);
    if (destinationFromService) this.placeArrival.set(destinationFromService);
  }

  handleReserve(trip: any): void {
    this.selectedTrip = trip;
    this.stops = [
      {
        time: trip.departureTime,
        title: trip.origin,
        subtitle: 'Accueil embarquement jusqu’à 2 min avant le départ',
      },
      { time: trip.arrivalTime, title: trip.destination },
    ];
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  private calculateDuration(departure: string, arrival: string): string {
    // Format HHhMM => convertir en minutes
    const depMatch = departure.match(/(\d+)h(\d+)/);
    const arrMatch = arrival.match(/(\d+)h(\d+)/);

    if (!depMatch || !arrMatch) return '';

    const depMinutes = parseInt(depMatch[1]) * 60 + parseInt(depMatch[2]);
    const arrMinutes = parseInt(arrMatch[1]) * 60 + parseInt(arrMatch[2]);

    let durationMinutes = arrMinutes - depMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Traversée minuit

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }
}
