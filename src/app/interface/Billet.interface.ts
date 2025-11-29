import { Voyage } from './Voyage.interface';

export interface Billet {
  id: string;
  idUser: string;
  voyage: Voyage;
}
