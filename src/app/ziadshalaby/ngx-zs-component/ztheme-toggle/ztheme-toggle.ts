// ==============================================
// Imports
// ==============================================

import { Component, signal, HostListener, effect, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';


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
  templateUrl: './ztheme-toggle.html',
  styleUrl: './ztheme-toggle.css'
})
export class ZthemeToggle {


  // ==============================================
  // Signals
  // ==============================================

  readonly currentTheme = signal<themeTypes>('light');
  readonly isOpen = signal<boolean>(false);


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
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as themeTypes | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    } else {
      this.currentTheme.set(systemPrefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes (only if no user preference is saved)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme.set(e.matches ? 'dark' : 'light');
      }
    });

    // Sync theme with DOM and localStorage whenever it changes
    effect(() => {
      const theme = this.currentTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
      document.body.className = this.bodyClass();
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
  }


  // ==============================================
  // Host Listeners
  // ==============================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('ZS-theme-toggle') && this.isOpen()) {
      this.isOpen.set(false);
    }
  }
}