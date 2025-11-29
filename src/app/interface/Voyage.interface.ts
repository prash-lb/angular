import { Section } from "./Place.interface";

export interface Voyage {
  depart: string;
  arrive: string;
  dateDepart: string;
  dateArrive: string;
  nombreVoyageur: number;
  duration: string;
  sections: Section[];
  // Aperçu optionnel pour l'affichage dans les cartes
  previewModes?: string[];
  transfers?: number;
}
