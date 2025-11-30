import { Section } from './Place.interface';

export interface Voyage {
  depart: string;
  arrive: string;
  dateDepart: string;
  dateArrive: string;
  nombreVoyageur: number;
  duration: string;
  sections: Section[];
  previewModes?: string[];
  transfers?: number;
}
