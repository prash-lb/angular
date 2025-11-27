import { Component, inject, signal } from '@angular/core';
import { TrainService } from '../shared/train.service';
import { FormsModule } from '@angular/forms';
import { Place } from '../interface/Place.interface';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Search,
  MapPin,
  Calendar,
  Users,
  Ticket,
} from 'lucide-angular';
import { Voyage } from '../interface/Voyage.interface';
@Component({
  selector: 'app-home',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public autoCompleteVille = signal<Place[]>([]);
  public searchText: string = '';
  public selectedVille = signal<Place | undefined>(undefined);

  private trainService = inject(TrainService);
  private router = inject(Router);

  readonly Search = Search;
  readonly MapPin = MapPin;
  readonly Calendar = Calendar;
  readonly Users = Users;
  readonly Ticket = Ticket;

  public departQuery: string = '';
  public arriveeQuery: string = '';
  public date: string = '';
  public passagers: number = 1;

  public autoCompleteResults = signal<Place[]>([]);
  public activeField: 'depart' | 'arrivee' | null = null;

  public selectedDepart: Place | undefined;
  public selectedArrivee: Place | undefined;

  public onInput(query: string, field: 'depart' | 'arrivee'): void {
    this.activeField = field;

    this.trainService.autoCompletionPlace(query).subscribe((data) => {
      this.autoCompleteResults.set(data);
    });
  }

  public selectSuggestion(place: Place): void {
    if (this.activeField === 'depart') {
      this.departQuery = place.name;
      this.selectedDepart = place;
    } else if (this.activeField === 'arrivee') {
      this.arriveeQuery = place.name;
      this.selectedArrivee = place;
    }
    this.autoCompleteResults.set([]);
    this.activeField = null;
  }

  public onSubmit(): void {
    if (this.selectedDepart && this.selectedArrivee) {
      const voyage: Voyage = {
        arrive: JSON.stringify(this.selectedArrivee),
        depart: JSON.stringify(this.selectedDepart),
        nombreVoyageur: this.passagers,
        dateDepart: this.date,
        dateArrive: '',
        duration: '',
      };
      this.router.navigate(['/reservation', voyage]);
    }
  }
}

// public autoComplete(i: string): void {
//   this.trainService.autoCompletionPlace(i).subscribe((data) => {
//     this.autoCompleteVille.set(data);
//   });
// }

// public selectSuggestion(place: Place): void {
//   this.searchText = place.name;
//   this.selectedVille.set(place);
//   this.autoCompleteVille.set([]);
// }

// public redirectionReservation(): void {
//   this.router.navigate([
//     '/reservation',
//     this.selectedVille()?.id,
//     this.selectedVille()?.name,
//   ]);
// }
