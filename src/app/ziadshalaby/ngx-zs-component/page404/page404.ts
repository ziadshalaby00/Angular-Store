import { RouterModule } from '@angular/router';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ZS-page404',
  imports: [RouterModule],
  templateUrl: './page404.html',
  styleUrl: './page404.css'
})
export class Page404 {
  // ========================================================================
  // Inputs
  // ========================================================================
  readonly title = input('Page Not Found');
  readonly message = input('Hmm… this page doesn’t seem to exist. Try checking the URL or going back home.');
  readonly icon = input('fa-ghost');

  readonly showButton = input(true);
  readonly buttonText = input('Go Home');
  readonly routerLink = input<string>('/');

  // ========================================================================
  // Outputs
  // ========================================================================
  readonly onAction = output<void>();
}
