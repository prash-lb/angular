import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Voyage } from '../interface/Voyage.interface';
import { TimelineStep } from '../interface/Timeline.interface';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
})
export class Timeline {
  public voyage = input<Voyage | null>(null);
  
  public steps = input<TimelineStep[]>([]);

  public duration = input<String>('');

  public details = output<void>();
}
