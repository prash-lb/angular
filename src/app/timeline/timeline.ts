import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineStop {
  /** Heure affichée (ex: "15:36") */
  time: string;
  /** Titre (ex: "PARIS - GARE DE LYON - HALL 1 & 2") */
  title: string;
  /** Sous-texte optionnel (ex: "Accueil embarquement...") */
  subtitle?: string;
  /** Style pastille pleine/majeure */
  major?: boolean;
}

export interface TimelineAmenities {
  /** texte + petite icône éventuelle côté template */
  items: string[];
  /** code train, ex: "TGV INOUI n° 6117" */
  serviceName?: string;
  /** logo small (optionnel) */
  logoUrl?: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.html',
  styleUrls: ['./timeline.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timeline {
  /** Arrêts (au moins 2: départ + arrivée) */
  @Input() stops: TimelineStop[] = [];

  /** Durée totale (ex: "3h20") */
  @Input() duration!: string;

  /** Carte “tronçon” optionnelle au milieu */
  @Input() amenities?: TimelineAmenities;

  /** Clic sur "Voir + de détails" */
  @Output() details = new EventEmitter<void>();

  onDetails() {
    this.details.emit();
  }

  /** Index du “bloc” central (entre départ/arrivée) pour insérer la carte */
  get middleIndex(): number {
    // place la carte entre le 1er et le dernier (après le premier stop)
    return Math.min(Math.max(1, Math.floor(this.stops.length / 2)), Math.max(1, this.stops.length - 1));
  }
}
