// ==============================================
// Imports
// ==============================================

import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavItem, NavbarItem } from '../NavItemFolder/nav-item/nav-item';
import { ButtonVariant, Button } from '../FormCompFolder/button/button';
import { FormSize, FormStyle } from '../palette-service/palette-service';

// ==============================================
// Interfaces & Types
// ==============================================

export interface UserProfile {
  name: string;
  username?: string;
  email?: string;
  imageUrl?: string;
  [key: string]: any;
}

export type NavbarItemExport = Omit<NavbarItem, 'childrenOpenWindow'>;

export interface SiteNameConfigType {
  siteName: string;
  siteNameColorClass?: string;
}

export interface AuthButtonsType {
  showAuthButtons: boolean;
  login?: {
    btnStyle?: FormStyle,
    variant?: ButtonVariant,
    size?: FormSize,
    icon?: string | null
  }
  signup?: {
    btnStyle?: FormStyle,
    variant?: ButtonVariant,
    size?: FormSize,
    icon?: string | null
  }
}

// ==============================================
// Component Decorator
// ==============================================

@Component({
  selector: 'ZS-navbar',
  imports: [RouterModule, CommonModule, NavItem, Button],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  // ==============================================
  // Inputs
  // ==============================================

  readonly fixed = input<boolean>(true);

  readonly logoUrl = input<string | undefined>();
  readonly siteNameConfig = input<SiteNameConfigType | undefined>();

  readonly authButtons = input<AuthButtonsType>({ showAuthButtons: false });
  readonly showUserSection = input<boolean>(true);
  readonly showSearchBar = input<boolean>(false);

  readonly navItems = input<NavbarItemExport[]>([]);

  readonly isLoggedIn = input<boolean>(false);
  readonly userProfile = input<UserProfile | undefined>();

  readonly userMenuItems = input<NavbarItemExport[]>([]);

  readonly searchPlaceholder = input<string>('Search...');
  
  // ==============================================
  // Outputs
  // ==============================================

  readonly loginClickedEv = output<void>();
  readonly signupClickedEv = output<void>();
  readonly searchSubmittedEv = output<string | null>();

  // ==============================================
  // Models
  // ==============================================

  readonly searchValue = model<string | null>(null);
  readonly isMobileMenuOpen = model<boolean>(false);

  // ==============================================
  // Internal State (Signals)
  // ==============================================

  readonly isUserMenuOpen = signal<boolean>(false);
  readonly isMoreOpen = signal<boolean>(false);

  // ==============================================
  // Computed Properties
  // ==============================================

  readonly visibleNavItems = computed<NavbarItem[]>(() => {
    const items = this.navItems();
    const limit = this.showSearchBar() ? 2 : 5;
    return items.slice(0, limit).map(item => this.toNavbarItem(item, true));
  });

  readonly moreNavItems = computed<NavbarItem[]>(() => {
    const items = this.navItems();
    const start = this.showSearchBar() ? 2 : 5;
    return items.slice(start).map(item => this.toNavbarItem(item, true));
  });

  readonly mobileNavItems = computed<NavbarItem[]>(() =>
    this.navItems().map(item => this.toNavbarItem(item, false))
  );

  readonly getUserMenuItems = computed<NavbarItem[]>(() =>
    this.userMenuItems().map(item => this.toNavbarItem(item, false))
  );

  // ==============================================
  // Private Helper Methods
  // ==============================================

  private toNavbarItem(item: NavbarItemExport, childrenOpenWindow = false): NavbarItem {
    return {
      ...item,
      childrenOpenWindow,
      children: item.children?.map(child => this.toNavbarItem(child, childrenOpenWindow)) ?? []
    };
  }

  // ==============================================
  // Event Handlers
  // ==============================================

  onSearchSubmit(): void {
    this.searchSubmittedEv.emit(this.searchValue());
  }

  onLogin(): void {
    this.loginClickedEv.emit();
  }

  onSignup(): void {
    this.signupClickedEv.emit();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(value => !value);
  }

  closeAllMenus(): void {
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
    this.isMoreOpen.set(false);
  }

  itemClicked(event: NavbarItem): void {
    this.closeAllMenus();
  }

  // ==============================================
  // Lifecycle Hooks
  // ==============================================

  private resizeObserver!: ResizeObserver;

  ngOnInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (window.innerWidth >= 1024) {
        this.isMobileMenuOpen.set(false);
      }
    });
    this.resizeObserver.observe(document.body);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }
}