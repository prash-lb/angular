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
import { TimelineStep } from '../interface/Timeline.interface';
import { buildTimelineStepsFromVoyage } from '../timeline/timeline.utils';
import { buildNavitiaDateTime, calculateDuration } from './reservation.utils';

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

  public steps = signal<TimelineStep[]>([]);


  private getJourneys(): void {
    const origin = this.placeDepart();
    const destination = this.placeArrival();
    const rawDate = this.date();

    if (!origin || !destination) {
      this.trips.set([]);
      return;
    }

  console.log('Raw Date:', rawDate);
  const apiDate = buildNavitiaDateTime(rawDate);
  console.log('API Date:', apiDate);
    this.loading.set(true);
    this.trainService.getJourneys(origin.id, destination.id, apiDate).subscribe({
      next: (journeys) => {
        this.trips.set(
          journeys.map((journey) => {
            const steps = buildTimelineStepsFromVoyage(journey as any);

            // Tag pour les modes de transport (exclut marche/attente)
            const transportLabels = steps
              .filter((s) => s.kind !== 'walk' && s.kind !== 'waiting')
              .map((s) => (s.label || s.kind).toString());
            const previewModes = Array.from(new Set(transportLabels)).slice(0, 5);

            const transfers = steps.filter((s) => s.kind === 'waiting' || s.kind === 'transfer').length;

            return {
              depart: origin.name,
              arrive: destination.name,
              dateDepart: journey.departureTime,
              dateArrive: journey.arrivalTime,
              duration: calculateDuration(
                journey.departureTime,
                journey.arrivalTime
              ),
              nombreVoyageur: this.nbPassager(),
              sections: journey.sections,
              previewModes,
              transfers,
            } as Voyage;
          })
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

    if (!this.date() || this.date().trim() === '') {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      this.date.set(`${year}-${month}-${day}`);
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
    console.log('reserve clicked for trip:', trip);
    console.log('trip.sections:', trip.sections);

    this.selectedTrip.set(trip);

    const steps = buildTimelineStepsFromVoyage(trip);
    console.log('Steps timeline :', steps);

    this.steps.set(steps);
    this.modalOpen.set(true);
  }

  public closeModal(): void {
    this.modalOpen.set(false);
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
