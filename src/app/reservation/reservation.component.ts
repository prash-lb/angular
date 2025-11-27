import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../design-system/card/card';
import { Modal } from '../design-system/modal/modal';
import { Timeline } from '../timeline/timeline';
import { Place } from '../interface/Place.interface';
import { TrainService } from '../shared/train.service';
import { Voyage } from '../interface/Voyage.interface';
import { AuthService } from '../shared/auth.service';
import { LoginComponent } from '../auth/login/login.component';

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
  private authService = inject(AuthService);
  public placeArrival = signal<Place | undefined>(undefined);
  public placeDepart = signal<Place | undefined>(undefined);
  public date = signal<string>('');
  public nbPassager = signal<number>(1);
  public trips = signal<Voyage[]>([]);
  public modalOpen = false;
  public selectedTrip = signal<Voyage | null>(null);

  private getJourneys(): void {
    const origin = this.placeDepart();
    const destination = this.placeArrival();
    const date = this.date();
    if (!origin || !destination) {
      this.trips.set([]);
      return;
    }

    this.trainService
      .getJourneys(origin.id, destination.id, date)
      .subscribe((journeys) => {
        this.trips.set(
          journeys.map((journey) => ({
            depart: origin.name,
            arrive: destination.name,
            dateDepart: journey.departureTime,
            dateArrive: journey.arrivalTime,
            duration: this.calculateDuration(
              journey.departureTime,
              journey.arrivalTime
            ),
            nombreVoyageur: this.nbPassager(),
          }))
        );
      });
  }

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

    this.getJourneys();
  }

  public handleReserve(trip: Voyage): void {
    this.selectedTrip.set(trip);
    this.modalOpen = true;
  }

  public closeModal(): void {
    this.modalOpen = false;
  }

  private calculateDuration(departure: string, arrival: string): string {
    const depMatch = departure.match(/(\d+)h(\d+)/);
    const arrMatch = arrival.match(/(\d+)h(\d+)/);

    if (!depMatch || !arrMatch) return '';

    const depMinutes = parseInt(depMatch[1]) * 60 + parseInt(depMatch[2]);
    const arrMinutes = parseInt(arrMatch[1]) * 60 + parseInt(arrMatch[2]);

    let durationMinutes = arrMinutes - depMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  }

  public reservation(): void {}
}
