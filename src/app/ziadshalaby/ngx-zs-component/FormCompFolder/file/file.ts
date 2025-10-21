import { Component, computed, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { BaseSize, FormPaletteMap, FormStyle } from '../../palette-service/palette-service';
import { ValidatorFn } from '../input/input';
import { Label } from '../label/label';
import { InputErrors } from '../input-errors/input-errors';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';

export interface FileData {
  name: string;
  size: number;
  type: string;
  url?: string;
};
export type FilesType = Map<string, FileData>;
export type AcceptType =
  // Generic wildcards
  | 'image/*'
  | 'video/*'
  | 'audio/*'
  | 'text/*'
  | 'application/*'

  // الصور
  | '.jpg' | '.jpeg' | '.png' | '.gif' | '.webp' | '.svg' | '.bmp' | '.tiff' | '.ico' | '.heic' | '.heif'

  // الفيديو
  | '.mp4' | '.mov' | '.avi' | '.mkv' | '.webm' | '.flv' | '.wmv' | '.m4v' | '.3gp' | '.mpeg' | '.mpg'

  // الصوت
  | '.mp3' | '.wav' | '.ogg' | '.flac' | '.aac' | '.m4a' | '.wma' | '.opus' | '.aiff' | '.mid'

  // النصوص والمستندات
  | '.txt' | '.pdf' | '.doc' | '.docx' | '.rtf' | '.odt' | '.pages'

  // جداول البيانات والعروض التقديمية
  | '.xls' | '.xlsx' | '.csv' | '.ods' | '.numbers'
  | '.ppt' | '.pptx' | '.key' | '.odp'

  // البرمجة والبيانات
  | '.json' | '.xml' | '.yaml' | '.yml' | '.html' | '.htm' | '.xhtml'
  | '.js' | '.ts' | '.jsx' | '.tsx' | '.css' | '.scss' | '.sass'
  | '.sql' | '.sqlite' | '.db' | '.log'

  // الأرشيف والضغط
  | '.zip' | '.rar' | '.7z' | '.tar' | '.gz' | '.bz2' | '.xz' | '.dmg' | '.iso'

  // تنسيقات أخرى شائعة
  | '.epub' | '.mobi' | '.azw' | '.psd' | '.ai' | '.fig' | '.sketch'
  | '.dwg' | '.dxf' | '.stl' | '.obj' | '.fbx' | '.glb' | '.gltf'

  // MIME Types مباشرة (اختياري لكن شائع)
  | 'application/pdf'
  | 'application/json'
  | 'application/zip'
  | 'application/x-rar-compressed'
  | 'application/octet-stream'
  | 'text/plain'
  | 'text/csv'
  | 'text/html'
  | 'image/jpeg'
  | 'image/png'
  | 'video/mp4'
  | 'audio/mpeg'

  // السماح بأي سلسلة نصية مخصصة
  | string;

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

  readonly disabled = input<boolean>(false);
  readonly isReadonly = input<boolean>(false);
  readonly required = input<boolean>(false);

  readonly validateFns = input<ValidatorFn<FilesType>[]>([]);

  readonly autofocus = input<boolean>(false);
  readonly size = input<BaseSize>('md');

  readonly accept = input<string>('image/*');
  readonly multiple = input<boolean>(false);
  readonly maxSize = input<number>((5 * 1024 * 1024) / (1024 * 1024)); // 5MB
  readonly allowPreview = input<boolean>(true);

  //TODO: maxFiles

  // ==============================================================================
  // Model
  // ==============================================================================

  readonly files = model<FilesType>(new Map([
    [
      '🛒 Ordering Cycle - Detailed Specification.pdf_368885_application/pdf',
      {
        name: '🛒 Ordering Cycle - Detailed Specification.pdf',
        size: 368885,
        type: 'application/pdf',
        url: 'blob:http://localhost:4200/8d9dc3bf-db30-4b83-a3f8-921160d7c5af'
      }
    ]
  ]));
  readonly touched = model<boolean>(false); // Tracks if the user has interacted with the input

  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // ============================================================================
  // Signals & Computed
  // ============================================================================
  readonly palette = computed(() => FormPaletteMap.get(this.inputStyle())!);

  readonly hasFiles = computed(() => this.files().size > 0);

  readonly totalSize = computed(() =>
    [...this.files().values()].reduce((sum, f) => sum + f.size, 0)
  );

  readonly disabledOrReadonly = computed<boolean>(() => this.disabled() || this.isReadonly());

  readonly error = computed<string[]>(() => {
    const hasFiles = this.hasFiles()
    const files = this.files();
    const required = this.required();

    // Only validate after user interaction
    if (!this.touched()) return [];

    const errors: string[] = [];

    // Required validation
    if (required && !hasFiles) {
      errors.push('This field is required');
    }

    if(this.totalSize() > this.maxSize()) {
      errors.push(`Total file size exceeds ${this.formatSize(this.maxSize())}`);
    }

    // Custom validator
    for (const fn of this.validateFns()) {
      const result = fn(files);
      if (Array.isArray(result)) errors.push(...result);
    }

    return errors.length > 0 ? errors : [];
  });
  // ============================================================================
  // Methods
  // ============================================================================
  handleFileChange(event: Event) {
    if (this.disabledOrReadonly()) return;

    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const selected: FileData[] = Array.from(input.files).map((f) => ({
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

    // ✅ Reset native <input> value to allow re-selecting same file again
    input.value = '';

    console.log(this.files())
    console.log(input?.files)
  }

  removeFile(id: string) {
    if (this.isReadonly() || this.disabled()) return;

    this.files.update((prev: FilesType) => {
      const next: FilesType = new Map(prev)
      next.delete(id)

      return next;
    })

    // Reset native <input type="file">
    const inputEl = this.fileInputRef()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }

    console.log(this.files())
    console.log(inputEl?.files)
  }

  private fileKey(f: FileData): string {
    return `${f.name}_${f.size}_${f.type}`;
  }

  formatSize(size: number | undefined) {
    if (!size) return 'Unknown'

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  preview(url: string | undefined) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
