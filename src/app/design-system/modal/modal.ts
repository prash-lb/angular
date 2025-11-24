import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
})
export class Modal {
  /** Titre du modal */
  @Input() title = '';
  /** Contrôle de visibilité */
  @Input() open = false;
  /** Événement fermeture */
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
