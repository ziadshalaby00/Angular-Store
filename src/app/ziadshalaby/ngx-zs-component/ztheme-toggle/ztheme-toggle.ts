import { Component, signal, HostListener, effect, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type themeTypes = 'light' | 'dark';

@Component({
  selector: 'ZS-theme-toggle',
  imports: [CommonModule],
  templateUrl: './ztheme-toggle.html',
  styleUrl: './ztheme-toggle.css'
})
export class ZThemeToggle {
  // ✅ Signals
  currentTheme = signal<themeTypes>('light');
  isOpen = signal<boolean>(false);

  // ✅ Input signals
  bodyBgClass = input<string>('bg-white dark:bg-gray-900');
  bodyTextClass = input<string>('text-gray-900 dark:text-gray-100');

  // ✅ Output events
  themeChange = output<themeTypes>();

  constructor() {
    // Initialize theme from localStorage or prefers-color-scheme
    const savedTheme: themeTypes = localStorage.getItem('theme') as 'light' | 'dark';
    const systemDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    } else {
      this.currentTheme.set(systemDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme.set(e.matches ? 'dark' : 'light');
      }
    });

    // Effect to sync theme with DOM and localStorage
    effect((): void => {
      const theme: themeTypes = this.currentTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);

      // ✅ Apply classes to body
      document.body.className = `${this.bodyBgClass()} ${this.bodyTextClass()}`;
    });
  }

  // ✅ Component methods
  toggleOpen(): void {
    this.isOpen.set(!this.isOpen());
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.set(theme);
    this.isOpen.set(false);
    this.themeChange.emit(theme); // 👈 Emit to parent
  }

  // ✅ Host listeners
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;
    if (!target.closest('ZS-theme-toggle') && this.isOpen()) {
      this.isOpen.set(false);
    }
  }
}