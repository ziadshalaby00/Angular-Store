import { Component, computed, inject, input } from '@angular/core';
import { ExtractorService } from '../../extractor-service/extractor-service';

// ==============================================================================
// Component Definition
// ==============================================================================

@Component({
  selector: 'ZS-input-errors',
  imports: [],
  templateUrl: './input-errors.html',
  styleUrl: './input-errors.css'
})
export class InputErrors {
  // ==============================================================================
  // Service
  // ==============================================================================
  readonly  extractorService: ExtractorService = inject(ExtractorService)


  // ==============================================================================
  // Inputs
  // ==============================================================================

  readonly Id = input<string>(crypto.randomUUID());
  readonly errors = input<(string[])[]>([]);

  // ==============================================================================
  // Computed Signals
  // ==============================================================================

  readonly extractedErrors = computed<string[]>(() => this.extractorService.extract(this.errors()))
}
