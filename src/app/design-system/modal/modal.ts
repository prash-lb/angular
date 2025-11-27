import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrls: ['./modal.scss'],
})
export class Modal {
  title = input<string>('');
  open = input<boolean>(false);
  close = output<void>();

  onClose(): void {
    this.close.emit();
  }
}
