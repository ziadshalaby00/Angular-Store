import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZnavItems, NavbarItem } from '../znav-items/znav-items';

// =============================================================================
// الواجهات والأنواع (Interfaces & Types)
// =============================================================================

export interface UserProfile {
  name: string;
  imageUrl?: string;
  email?: string;
}

export type NavbarItemExport = Omit<NavbarItem, 'childrenOpenWindow'>;

export interface SiteNameConfigType {
  siteName: string;
  siteNameColorClass?: string;
}

export interface AuthButtonsType {
  showAuthButtons: boolean;
  loginBtnColorClass?: string,
  signupBtnColorClass?: string,
}

// =============================================================================
// تعريف المكون (Component Decorator)
// =============================================================================

@Component({
  selector: 'ZS-navbar',
  imports: [RouterModule, CommonModule, ZnavItems],
  templateUrl: './znavbar.html',
  styleUrl: './znavbar.css'
})
export class Znavbar {

  // =============================================================================
  // المدخلات (Inputs)
  // =============================================================================

  readonly fixed = input<boolean>(true);

  // الإدخالات القابلة للتخصيص
  readonly logoUrl = input<string | undefined>();
  readonly siteNameConfig = input<SiteNameConfigType | undefined>();

  readonly authButtons = input<AuthButtonsType>();
  readonly showUserSection = input<boolean>(true);
  readonly showSearchBar = input<boolean>(false);

  readonly navItems = input<NavbarItemExport[]>([]);

  readonly isLoggedIn = input<boolean>(false);
  readonly userProfile = input<UserProfile | undefined>();

  readonly userMenuItems = input<NavbarItemExport[]>([]);

  readonly searchPlaceholder = input<string>('Search...');

  // =============================================================================
  // المخرجات (Outputs)
  // =============================================================================

  readonly loginClicked = output<void>();
  readonly signupClicked = output<void>();
  readonly searchSubmitted = output<string>();

  // =============================================================================
  // الإشارات (Signals) للحالة الداخلية
  // =============================================================================

  // حالة القائمة المتنقلة (للشاشات الصغيرة)
  readonly isMobileMenuOpen = signal<boolean>(false);

  // حالة قائمة المستخدم
  readonly isUserMenuOpen = signal<boolean>(false);

  // حالة قائمة "More"
  readonly isMoreOpen = signal<boolean>(false);

  // قيمة البحث
  readonly searchValue = signal<string>('');

  // =============================================================================
  // الحوسبة (Computed Properties)
  // =============================================================================

  readonly visibleNavItems = computed<NavbarItem[]>(() => {
    if (this.showSearchBar()) {
      return this.navItems().slice(0, 2).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
    }
    return this.navItems().slice(0, 5).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
  });

  readonly moreNavItems = computed<NavbarItem[]>(() => {
    if (this.showSearchBar()) {
      return this.navItems().slice(2).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
    }
    return this.navItems().slice(5).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
  });

  readonly mobileNavItems = computed<NavbarItem[]>(() => 
    this.navItems().map((n: NavbarItemExport) => this.toNavbarItem(n, false))
  );

  readonly getUserMenuItems = computed<NavbarItem[]>(() => 
    this.userMenuItems().map((n: NavbarItemExport) => this.toNavbarItem(n, false))
  );

  // =============================================================================
  // الدوال الخاصة (Private Helper Methods)
  // =============================================================================

  private toNavbarItem(item: NavbarItemExport, childrenOpenWindow = false): NavbarItem {
    return {
      ...item,
      childrenOpenWindow,
      children: item.children?.map(child => this.toNavbarItem(child, childrenOpenWindow)) ?? []
    };
  }

  // =============================================================================
  // معالجات الأحداث (Event Handlers)
  // =============================================================================

  // دالة للبحث
  onSearchSubmit(): void {
    this.searchSubmitted.emit(this.searchValue());
  }

  // دالة لتسجيل الدخول
  onLogin(): void {
    this.loginClicked.emit();
  }

  // دالة للتسجيل
  onSignup(): void {
    this.signupClicked.emit();
  }

  // دالة لتبديل حالة القائمة المتنقلة
  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }

  // دالة لتبديل قائمة المستخدم
  toggleUserMenu() {
    this.isUserMenuOpen.update(value => !value);
  }

  // إغلاق جميع القوائم
  closeAllMenus() {
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
    this.isMoreOpen.set(false);
  }

  // معالجة النقر على عنصر القائمة
  itemClicked(event: NavbarItem) {
    this.closeAllMenus();
  }

  // =============================================================================
  // دورة حياة المكون (Lifecycle Hooks)
  // =============================================================================

  private resizeObserver!: ResizeObserver;

  ngOnInit() {
    this.resizeObserver = new ResizeObserver(() => {
      if (window.innerWidth >= 1024) {
        this.isMobileMenuOpen.set(false);
      }
    });
    this.resizeObserver.observe(document.body);
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }
}