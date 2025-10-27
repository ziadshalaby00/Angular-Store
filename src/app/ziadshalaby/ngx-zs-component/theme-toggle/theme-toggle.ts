import { Component, signal, HostListener, effect, output, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { zIndices, ZIndicesType } from '../z-index';


// ==============================================
// Types
// ==============================================
export type themeTypes = 'light' | 'dark';


// ==============================================
// Component Metadata
// ==============================================
@Component({
  selector: 'ZS-theme-toggle',
  imports: [CommonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css'
})
export class ThemeToggle {
  readonly zIndices: ZIndicesType = zIndices;

  // ==============================================
  // Signals
  // ==============================================
  readonly currentTheme = signal<themeTypes>('light');
  readonly isOpen = signal<boolean>(false);
  private readonly userSelectedTheme = signal<boolean>(false);

  // ==============================================
  // Inputs
  // ==============================================
  readonly bodyClass = input<string>('bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100');


  // ==============================================
  // Outputs
  // ==============================================
  readonly themeChangeEv = output<themeTypes>();


  // ==============================================
  // Lifecycle & Side Effects
  // ==============================================
  constructor() {
    // ① تهيئة الثيم
    const savedTheme = localStorage.getItem('theme') as themeTypes | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedTheme) {
      this.currentTheme.set(savedTheme);
      this.userSelectedTheme.set(true);
    } else {
      this.currentTheme.set(systemPrefersDark.matches ? 'dark' : 'light');
    }

    // ② مراقبة تغيّر ثيم النظام (لو المستخدم لم يختر يدويًا)
    effect((onCleanup) => {
      const listener = (e: MediaQueryListEvent) => {
        if (!this.userSelectedTheme()) {
          this.currentTheme.set(e.matches ? 'dark' : 'light');
        }
      };

      systemPrefersDark.addEventListener('change', listener);
      onCleanup(() => systemPrefersDark.removeEventListener('change', listener));
    });

    // ③ مزامنة الثيم مع DOM و localStorage
    effect(() => {
      const theme = this.currentTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.body.className = this.bodyClass();

      if (this.userSelectedTheme()) {
        localStorage.setItem('theme', theme);
      }
    });
  }

  // ==============================================
  // Component Methods
  // ==============================================
  toggleOpen(): void {
    this.isOpen.set(!this.isOpen());
  }

  setTheme(theme: themeTypes): void {
    this.currentTheme.set(theme);
    this.isOpen.set(false);
    this.themeChangeEv.emit(theme);
    this.userSelectedTheme.set(true);
  }

  // ==============================================
  // Host Listeners
  // ==============================================
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('zs-theme-toggle') && this.isOpen()) {
      this.isOpen.set(false);
    }
  }
}