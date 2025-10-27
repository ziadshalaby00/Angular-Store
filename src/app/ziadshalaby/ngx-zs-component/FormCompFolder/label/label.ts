// ==============================================
// Component Metadata
// ==============================================
import { Component, computed, input } from '@angular/core';
import { BaseSize } from '../../palette-service';
import { CommonModule } from '@angular/common';

type sizeClassesType = Record<BaseSize, { label: string; hint: string }>;

@Component({
  selector: 'ZS-label',
  imports: [CommonModule],
  templateUrl: './label.html',
  styleUrl: './label.css'
})
export class Label {

  // ==============================================
  // Label & Hint Configuration
  // ==============================================
  readonly label   = input<string | null>(null);
  readonly hint    = input<string | null>(null);
  readonly hintId  = input<string | null>(null);
  readonly size    = input<BaseSize>('md')

  // ==============================================
  // Accessibility & State Inputs
  // ==============================================
  readonly required = input<boolean>(false);
  readonly for      = input<string | null>(null);

  
  // ==============================================
  // Computed Classes
  // ==============================================
  readonly sizeClasses = computed<{ label: string; hint: string }>(() => {
    const sizes: sizeClassesType = {
      sm: { label: 'text-xs', hint: 'text-[10px]' },
      md: { label: 'text-sm', hint: 'text-xs' },
      lg: { label: 'text-base', hint: 'text-sm' },
    };
    return sizes[this.size()];
  });
}