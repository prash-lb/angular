import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { BilletsService } from '../shared/billets.service';
import { Billet } from '../interface/Billet.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billets',
  imports: [CommonModule],
  templateUrl: './billets.component.html',
  styleUrl: './billets.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BilletsComponent implements OnInit {
  private billetService: BilletsService = inject(BilletsService);

  public loading: WritableSignal<boolean> = signal<boolean>(false);
  public billets: WritableSignal<Billet[]> = signal<Billet[]>([]);
  public billetTermine: WritableSignal<Billet[]> = signal<Billet[]>([]);
  public billetFutur: WritableSignal<Billet[]> = signal<Billet[]>([]);
  public activeTab: WritableSignal<'a-venir' | 'historique' | 'tous'> = signal<
    'a-venir' | 'historique' | 'tous'
  >('tous');

  private loadings(): void {
    this.loading.set(true);
    this.billetService.getBillet().subscribe({
      next: (listeBillets) => {
        this.billets.set(listeBillets);
        this.filterBillet();
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadings();
  }

  private filterBillet(): void {
    const dateActuelle = new Date();
    dateActuelle.setHours(0, 0, 0, 0);
    const futur: Billet[] = [];
    const passe: Billet[] = [];
    this.billets().map((billet: Billet) => {
      const dateArrive = new Date(billet.voyage.dateArrive);
      dateArrive.setHours(0, 0, 0, 0);
      if (dateArrive >= dateActuelle) {
        futur.push(billet);
      } else {
        passe.push(billet);
      }
    });
    this.billetFutur.set(futur);
    this.billetTermine.set(passe);
  }

  public getBilletAffiche(): Billet[] {
    switch (this.activeTab()) {
      case 'a-venir':
        return this.billetFutur();
      case 'historique':
        return this.billetTermine();
      case 'tous':
      default:
        return this.billets();
    }
  }

  public setActiveTab(status: string): void {
    switch (status) {
      case 'a-venir':
        this.activeTab.set('a-venir');
        break;
      case 'historique':
        this.activeTab.set('historique');
        break;
      default:
        this.activeTab.set('tous');
    }
  }

  public getBilletCount(status: string): number {
    switch (status) {
      case 'tous':
        return this.billets().length;
      case 'a-venir':
        return this.billetFutur().length;
      default:
        return this.billetTermine().length;
    }
  }

  public formatTicketDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  public isUpcoming(dateArrive: string): boolean {
    const now = new Date();
    const arriveDate = new Date(dateArrive);
    return arriveDate >= now;
  }

  public deleteBillet(billet: Billet): void {
    this.billetService.deleteBillet(billet.id).subscribe({
      next: () => {
        this.loadings();
      },
      error: (err: Error) => {
        console.error(err);
      },
    });
  }
}
