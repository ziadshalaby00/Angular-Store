// ==============================================
// Component Metadata
// ==============================================
import { Component, input } from '@angular/core';

@Component({
  selector: 'ZS-label',
  imports: [],
  templateUrl: './zlabel.html',
  styleUrl: './zlabel.css'
})
export class Zlabel {

  // ==============================================
  // Label & Hint Configuration
  // ==============================================
  readonly label   = input<string | null>(null);
  readonly hint    = input<string | null>(null);
  readonly hintID  = input<string | null>(null);

  // ==============================================
  // Accessibility & State Inputs
  // ==============================================
  readonly required = input<boolean>(false);
  readonly for      = input<string | null>(null);
}