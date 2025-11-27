import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Voyage } from '../interface/Voyage.interface';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
})
export class Timeline {
  public stops = input<Voyage | null>(null);

  public duration = input<String>('');

  public details = output<void>();
}
