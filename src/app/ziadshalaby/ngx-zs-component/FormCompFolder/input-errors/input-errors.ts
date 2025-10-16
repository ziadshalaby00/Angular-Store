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
  extractorService: ExtractorService = inject(ExtractorService)
  // ==============================================================================
  // Inputs
  // ==============================================================================

  readonly iId = input<string>(crypto.randomUUID());
  readonly errors = input<(string[])[]>([]);

  readonly extractedErrors = computed<string[]>(() => this.extractorService.extract(this.errors()))
}
