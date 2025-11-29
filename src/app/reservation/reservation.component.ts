import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
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
import { LocalService } from '../shared/local.service';
import { Router } from '@angular/router';
import { BilletsService } from '../shared/billets.service';
import { RechercheComponent } from '../recherche/recherche.component';
import { AlertOnReserveDirective } from '../directive/alerte.directive';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Card,
    Modal,
    Timeline,
    RechercheComponent,
    AlertOnReserveDirective,
  ],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private trainService: TrainService = inject(TrainService);
  private localService: LocalService = inject(LocalService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private billetService: BilletsService = inject(BilletsService);

  public placeArrival: WritableSignal<Place | undefined> = signal<
    Place | undefined
  >(undefined);
  public placeDepart: WritableSignal<Place | undefined> = signal<
    Place | undefined
  >(undefined);
  public date: WritableSignal<string> = signal<string>('');
  public nbPassager: WritableSignal<number> = signal<number>(1);
  public trips: WritableSignal<Voyage[]> = signal<Voyage[]>([]);
  public modalOpen: WritableSignal<boolean> = signal<boolean>(false);
  public selectedTrip: WritableSignal<Voyage | null> = signal<Voyage | null>(
    null
  );
  public loading: WritableSignal<boolean> = signal<boolean>(false);

  private getJourneys(): void {
    const origin = this.placeDepart();
    const destination = this.placeArrival();
    const date = this.date();
    if (!origin || !destination) {
      this.trips.set([]);
      return;
    }
    this.loading.set(true);
    this.trainService.getJourneys(origin.id, destination.id, date).subscribe({
      next: (journeys) => {
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
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error(err);
        this.loading.set(false);
        this.trips.set([]);
      },
    });
  }

  ngOnInit(): void {
    if (this.authService.connecte() && this.localService.getData('payload')) {
      const payload = JSON.parse(this.localService.getData('payload') ?? '');
      if (payload.placeArrival) this.placeArrival.set(payload.placeArrival);
      if (payload.placeDepart) this.placeDepart.set(payload.placeDepart);
      if (payload.date) this.date.set(payload.date);
      if (payload.passager) this.nbPassager.set(Number(payload.passager));
      if (payload.voyage) this.selectedTrip.set(payload.voyage);
      if (payload.modalOpen) this.modalOpen.set(payload.modalOpen);
      this.localService.removeData('payload');
    } else {
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
    }

    this.getJourneys();
  }

  public submit(Voyage: Voyage) {
    this.placeArrival.set(JSON.parse(Voyage.arrive));
    this.placeDepart.set(JSON.parse(Voyage.depart));
    this.date.set(Voyage.dateDepart);
    this.nbPassager.set(Voyage.nombreVoyageur);

    this.getJourneys();
  }

  public handleReserve(trip: Voyage): void {
    this.selectedTrip.set(trip);
    this.modalOpen.set(true);
  }

  public closeModal(): void {
    this.modalOpen.set(false);
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

  public reservation(): void {
    if (!this.authService.connecte()) {
      const payload = {
        voyage: this.selectedTrip(),
        passager: this.nbPassager(),
        placeArrival: this.placeArrival(),
        placeDepart: this.placeDepart(),
        date: this.date(),
        modalOpen: this.modalOpen(),
      };
      this.localService.saveData('payload', JSON.stringify(payload));
      this.router.navigate(['connexion']);
    } else {
      const trip = this.selectedTrip();
      if (trip) {
        trip.dateDepart = `${this.date()}T${trip.dateDepart}`;
        trip.dateArrive = `${this.date()}T${trip.dateArrive}`;
        this.billetService
          .postBillet(trip, this.localService.getData('id') ?? '')
          .subscribe({
            next: () => {
              this.router.navigate(['billet']);
            },
            error: (err: Error) => {
              console.error(err);
            },
          });
      }
    }
  }
}
