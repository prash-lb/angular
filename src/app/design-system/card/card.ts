import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class Card {
  public origin = input<string>('');
  public destination = input<string>('');
  public departureTime = input<string>('');
  public arrivalTime = input<string>('');
  public duration = input<string>('');
  public previewModes = input<string[]>([]);
  public transfers = input<number>(0);
  public buttonClick = output<void>();

  public onReserveClick(): void {
    this.buttonClick.emit();
  }
}
