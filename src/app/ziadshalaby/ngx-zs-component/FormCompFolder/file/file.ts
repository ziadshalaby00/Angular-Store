// ==============================================================================
// Imports
// ==============================================================================

import { Component, computed, ElementRef, input, model, output, signal, viewChild } from '@angular/core';
import { BaseSize, FormPaletteMap, FormStyle } from '../../palette-service/palette-service';
import { ChangeEventType, ValidatorFn } from '../input/input';
import { Label } from '../label/label';
import { InputErrors } from '../input-errors/input-errors';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

export interface FileData {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export type FilesType = Map<string, FileData>;

// ==============================================================================
// Component Metadata
// ==============================================================================

@Component({
  selector: 'ZS-file',
  imports: [Label, InputErrors, CommonModule, Button],
  templateUrl: './file.html',
  styleUrl: './file.css'
})
export class FileInput {

  // ==============================================================================
  // Inputs
  // ==============================================================================

  readonly Id = input<string>(crypto.randomUUID());
  readonly iName = input<string | null>(null);
  readonly label = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly placeholder = input<string | null>(null);
  readonly inputStyle = input<FormStyle>('secondary');

  readonly autofocus = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly validateFns = input<ValidatorFn<FileData[]>[]>([]);

  readonly accept = input<string>('');
  readonly multiple = input<boolean>(false);
  readonly maxSize = input<number>(5 * 1024 * 1024); // 5MB
  readonly allowPreview = input<boolean>(true);
  readonly maxFiles = input<number | 'infinity'>('infinity');

  // ==============================================================================
  // Outputs
  // ==============================================================================

  readonly changeEv = output<ChangeEventType<FileData[]>>();

  // ==============================================================================
  // Model
  // ==============================================================================

  readonly files = model<FilesType>(new Map());
  readonly touched = model<boolean>(false); // Tracks if the user has interacted with the input

  // ==============================================================================
  // ViewChild
  // ==============================================================================

  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // ==============================================================================
  // Computed Properties
  // ==============================================================================

  readonly palette = computed(() => FormPaletteMap.get(this.inputStyle())!);

  readonly hasFiles = computed(() => this.files().size > 0);

  readonly totalSize = computed(() =>
    this.filesMapToList().reduce((sum, f) => sum + f.size, 0)
  );

  readonly disabledOrReadonly = computed<boolean>(() => this.disabled() || this.isReadonly());

  readonly error = computed<string[]>(() => {
    const hasFiles = this.hasFiles();
    const files = this.files();
    const required = this.required();
    const totalSize = this.totalSize();
    const maxSize = this.maxSize();
    const maxFiles = this.maxFiles();
    const accept = this.accept();

    // Only validate after user interaction
    if (!this.touched()) return [];

    const errors: string[] = [];

    // Required validation
    if (required && !hasFiles) {
      errors.push('This field is required');
    }

    // Max size validation
    if (totalSize > maxSize) {
      errors.push(`Total file size exceeds ${this.formatSize(maxSize)}`);
    }

    // Max files validation
    if (maxFiles !== 'infinity' && files.size > maxFiles) {
      errors.push(`Total number of files exceeds ${maxFiles}`);
    }

    // Accept (file type) validation
    const invalidFiles = this.filesMapToList().filter(f => !this.matchesAccept(f, accept));
    if (invalidFiles.length > 0) {
      const names = invalidFiles.map(f => f.name).join(', ');
      errors.push(`Some files have unsupported types: ${names}`);
    }

    // Custom validators
    for (const fn of this.validateFns()) {
      const result = fn(this.filesMapToList());
      if (Array.isArray(result)) errors.push(...result);
    }

    return errors.length > 0 ? errors : [];
  });

  readonly filesMapToList = computed(() => {
    const files = this.files();
    return files.size ? Array.from(files.values()) : [];
  });

  // ==============================================================================
  // Event Handlers
  // ==============================================================================

  handleFileChange(event: Event): void {
    if (this.disabledOrReadonly()) return;

    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const selected: FileData[] = Array.from(input.files).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      url: this.allowPreview() ? URL.createObjectURL(f) : undefined,
    }));

    this.files.update((prev: FilesType) => {
      const multiple = this.multiple();
      const next = multiple ? new Map(prev) : new Map<string, FileData>();

      for (const nf of selected) {
        next.set(this.fileKey(nf), nf);
      }

      return next;
    });

    this.touched.set(true);
    this.emitChangeValue(this.filesMapToList(), false);

    // Reset native <input> value to allow re-selecting the same file
    input.value = '';
  }

  removeFile(id: string): void {
    if (this.isReadonly() || this.disabled()) return;

    this.files.update((prev: FilesType) => {
      const next = new Map(prev);
      const file = prev.get(id);

      if (file?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }

      next.delete(id);
      return next;
    });

    this.emitChangeValue(this.filesMapToList(), false);

    // Reset native file input
    const inputEl = this.fileInputRef()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  // ==============================================================================
  // Public Methods
  // ==============================================================================

  /** Forces the input to trigger a manual change event */
  public forceChange(fromForce: boolean = true): void {
    this.touched.set(true);
    this.emitChangeValue(this.filesMapToList(), fromForce);
  }


  // ==============================================================================
  // Private Helpers
  // ==============================================================================

  formatSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  preview(url: string | undefined): void {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private fileKey(f: FileData): string {
    return `${f.name}_${f.size}_${f.type}`;
  }

  private emitChangeValue(value: FileData[], fromForce: boolean = true): void {
    const valid = this.error().length === 0;
    this.changeEv.emit({ value, valid, fromForce });
  }

  private matchesAccept(file: FileData, accept: string): boolean {
    if (!accept) return true;

    const types = accept.split(',').map(t => t.trim().toLowerCase());

    return types.some(type => {
      if (type === '*/*') return true;

      // Wildcard MIME types (e.g., image/*)
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(`${baseType}/`);
      }

      // Exact MIME type match
      if (type.includes('/') && !type.startsWith('.')) {
        return file.type === type;
      }

      // File extension match (e.g., .jpg)
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }

      // Fallback: partial match in MIME type
      return file.type.includes(type);
    });
  }

  // ==============================================================================
  // Lifecycle Hooks
  // ==============================================================================

  ngOnDestroy(): void {
    this.files().forEach(f => {
      if (f.url?.startsWith('blob:')) {
        URL.revokeObjectURL(f.url);
      }
    });
  }
}