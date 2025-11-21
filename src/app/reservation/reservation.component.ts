import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  id = signal<string>('');
  name = signal<string>('');
  ngOnInit(): void {
    this.id.set(this.activatedRoute.snapshot.paramMap.get('id') ?? '');
    this.name.set(this.activatedRoute.snapshot.paramMap.get('name') ?? '');
    console.log('name :', this.name(), 'id:', this.id());
  }
}
