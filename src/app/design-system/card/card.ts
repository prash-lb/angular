import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  @Input() disabled: boolean = false;
  
  @Input() origin!: string;
  @Input() destination!: string;

  @Input() departureTime!: string;
  @Input() arrivalTime!: string;
  @Input() duration: string = '';

  @Input() button: string = 'Next';

  @Output() buttonClick = new EventEmitter<void>();

 onReserveClick(evt?: Event): void {
  evt?.preventDefault();
  evt?.stopPropagation();
  if (!this.disabled) this.buttonClick.emit();
}
}
