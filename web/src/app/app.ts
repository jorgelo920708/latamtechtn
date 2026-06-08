import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LatamCopyService } from './shared/services/latam-copy.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private copyService = inject(LatamCopyService);
  ready = signal(false);

  async ngOnInit(): Promise<void> {
    await this.copyService.init();
    this.ready.set(true);
  }
}
