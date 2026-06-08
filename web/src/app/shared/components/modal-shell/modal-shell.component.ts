import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './modal-shell.component.html',
  styleUrl: './modal-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalShellComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() closeLabel = 'Cerrar';
  @Output() dismiss = new EventEmitter<void>();

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.dismiss.emit();
  }
}
