import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Search,
  Calendar,
  Ticket,
  LucideIconData,
} from 'lucide-angular';
import { Voyage } from '../interface/Voyage.interface';
import { RechercheComponent } from '../recherche/recherche.component';
@Component({
  selector: 'app-home',
  imports: [FormsModule, LucideAngularModule, RechercheComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public readonly Search: LucideIconData = Search;
  public readonly Calendar: LucideIconData = Calendar;
  public readonly Ticket: LucideIconData = Ticket;

  private router: Router = inject(Router);

  public onSubmit(voyage: Voyage): void {
    this.router.navigate(['/reservation', voyage]);
  }
}
