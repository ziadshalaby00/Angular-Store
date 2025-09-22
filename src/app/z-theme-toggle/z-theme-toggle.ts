import { Component, signal, HostListener, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-z-theme-toggle',
  imports: [CommonModule],
  templateUrl: './z-theme-toggle.html',
  styleUrl: './z-theme-toggle.css'
})
export class ZThemeToggle {
  currentTheme = signal<'light' | 'dark'>('light');
  isOpen = signal(false);

  themeChange = output<'light' | 'dark'>();

  constructor() {
    // Initialize theme from localStorage or prefer-color-scheme
    effect(() => {
      const theme = this.currentTheme();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
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
  }

  toggleOpen() {
    this.isOpen.set(!this.isOpen());
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme.set(theme);
    this.isOpen.set(false);
    this.themeChange.emit(theme); // 👈 Emit to parent
  }

  // Close the menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-z-theme-toggle') && this.isOpen()) {
      this.isOpen.set(false);
    }
  }
}
