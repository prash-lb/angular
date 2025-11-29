import {
  Component,
  inject,
  input,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {
  Calendar,
  LucideAngularModule,
  LucideIconData,
  MapPin,
  Search,
  Ticket,
  Users,
} from 'lucide-angular';
import { TrainService } from '../shared/train.service';
import { Place } from '../interface/Place.interface';
import { Voyage } from '../interface/Voyage.interface';

export const differentPlacesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const departControl = formGroup.get('departForm');
  const arriveControl = formGroup.get('arriveForm');

  if (
    departControl &&
    arriveControl &&
    departControl.value &&
    arriveControl.value
  ) {
    if (departControl.value === arriveControl.value) {
      return { differentPlaces: true };
    }
  }

  return null;
};

@Component({
  selector: 'app-recherche',
  imports: [FormsModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.scss',
})
export class RechercheComponent {
  public readonly Search: LucideIconData = Search;
  public readonly MapPin: LucideIconData = MapPin;
  public readonly Calendar: LucideIconData = Calendar;
  public readonly Users: LucideIconData = Users;
  public readonly Ticket: LucideIconData = Ticket;

  private trainService: TrainService = inject(TrainService);
  public form: FormGroup<{
    departForm: FormControl<string | null>;
    arriveForm: FormControl<string | null>;
    dateForm: FormControl<string | null>;
    nbpassagerForm: FormControl<number | null>;
  }> = new FormGroup(
    {
      departForm: new FormControl<string | null>('', [Validators.required]),
      arriveForm: new FormControl<string | null>('', [Validators.required]),
      dateForm: new FormControl<string | null>(''),
      nbpassagerForm: new FormControl<number | null>(1, [Validators.min(1)]),
    },
    { validators: differentPlacesValidator }
  );
  public autoCompleteVille: WritableSignal<Place[]> = signal<Place[]>([]);
  public searchText: string = '';
  public selectedVille: WritableSignal<Place | undefined> = signal<
    Place | undefined
  >(undefined);
  public autoCompleteResults: WritableSignal<Place[]> = signal<Place[]>([]);
  public activeField: 'depart' | 'arrivee' | null = null;
  public selectedDepart: Place | undefined;
  public selectedArrivee: Place | undefined;
  public voyage: OutputEmitterRef<Voyage> = output<Voyage>();

  public onInput(field: 'depart' | 'arrivee'): void {
    this.activeField = field;
    const query =
      field === 'depart'
        ? this.form.get('departForm')?.value ?? ''
        : this.form.get('arriveForm')?.value ?? '';
    this.trainService.autoCompletionPlace(query).subscribe((data) => {
      this.autoCompleteResults.set(data);
    });
  }

  public selectSuggestion(place: Place): void {
    if (this.activeField === 'depart') {
      this.form.patchValue({
        departForm: place.name,
      });
      this.selectedDepart = place;
    } else if (this.activeField === 'arrivee') {
      this.form.patchValue({
        arriveForm: place.name,
      });
      this.selectedArrivee = place;
    }
    this.autoCompleteResults.set([]);
    this.activeField = null;
  }

  public onSubmit(): void {
    if (this.selectedDepart && this.selectedArrivee) {
      const voyage: Voyage = {
        arrive: JSON.stringify(this.selectedArrivee),
        depart: JSON.stringify(this.selectedDepart),
        nombreVoyageur: this.form.get('nbpassagerForm')?.value ?? 1,
        dateDepart: this.form.get('dateForm')?.value ?? '',
        dateArrive: '',
        duration: '',
        sections: [],
      };
      this.voyage.emit(voyage);
    }
  }
}
