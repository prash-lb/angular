import { Component, inject, signal } from '@angular/core';
import { TrainService } from '../shared/train.service';
import { FormsModule } from '@angular/forms';
import { Place } from '../interface/Place.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  trainService = inject(TrainService);
  router = inject(Router);
  autoCompleteVille = signal<Place[]>([]);
  searchText: string = '';
  selectedVille = signal<Place | undefined>(undefined);

  autoComplete(i: string) {
    this.trainService.autoCompletionPlace(i).subscribe((data) => {
      this.autoCompleteVille.set(data);
      console.log('liste:', this.autoCompleteVille());
    });
  }

  selectSuggestion(place: Place) {
    this.searchText = place.name;
    this.selectedVille.set(place);
    this.autoCompleteVille.set([]);
  }

  redirectionReservation() {
    console.log('place :', this.selectedVille());
    this.router.navigate([
      '/reservation',
      this.selectedVille()?.id,
      this.selectedVille()?.name,
    ]);
  }
}
