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
  public trainService = inject(TrainService);
  public router = inject(Router);
  public autoCompleteVille = signal<Place[]>([]);
  public searchText: string = '';
  public selectedVille = signal<Place | undefined>(undefined);

  public autoComplete(i: string): void {
    this.trainService.autoCompletionPlace(i).subscribe((data) => {
      this.autoCompleteVille.set(data);
    });
  }

  public selectSuggestion(place: Place): void {
    this.searchText = place.name;
    this.selectedVille.set(place);
    this.autoCompleteVille.set([]);
  }

  public redirectionReservation(): void {
    this.router.navigate([
      '/reservation',
      this.selectedVille()?.id,
      this.selectedVille()?.name,
    ]);
  }
}
