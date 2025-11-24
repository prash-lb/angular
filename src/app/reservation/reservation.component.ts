import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../interface/Place.interface';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  public placeArrival = signal<Place | undefined>(undefined);
  public placeDepart = signal<Place | undefined>(undefined);
  public date = signal<string>('');
  public nbPassager = signal<number>(1);

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
  }
}
