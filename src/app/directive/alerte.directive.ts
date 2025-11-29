import { Directive, HostListener, inject, Input } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Directive({
  selector: '[appReserveAlert]',
})
export class AlertOnReserveDirective {
  public reserveText: string = 'Réservation confirmée !';

  private authService: AuthService = inject(AuthService);

  @HostListener('click') onClick(): void {
    if (this.authService.connecte()) {
      alert(this.reserveText);
    } else {
      alert('Veuillez vous connecter pour réserver ce trajet.');
    }
  }
}
