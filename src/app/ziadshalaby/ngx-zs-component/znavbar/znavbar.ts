import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZnavItems, NavbarItem } from '../znav-items/znav-items';

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

@Component({
  selector: 'ZS-navbar',
  imports: [RouterModule, CommonModule, ZnavItems],
  templateUrl: './znavbar.html',
  styleUrl: './znavbar.css'
})
export class Znavbar {
  fixed = input<boolean>(true);

  // الإدخالات القابلة للتخصيص
  logoUrl = input<string | undefined>();
  siteNameConfig = input<SiteNameConfigType | undefined>();

  authButtons = input<AuthButtonsType>();
  showUserSection = input<boolean>(true);
  showSearchBar = input<boolean>(false);

  navItems = input<NavbarItemExport[]>([]);

  isLoggedIn = input<boolean>(false);
  userProfile = input<UserProfile | undefined>();

  userMenuItems = input<NavbarItemExport[]>([]);

  // ==================================================================================

  // الأحداث الصادرة
  loginClicked = output<void>();
  signupClicked = output<void>();
  searchSubmitted = output<string>();

  // حالة القائمة المتنقلة (للشاشات الصغيرة)
  isMobileMenuOpen = signal<boolean>(false);

  // حالة قائمة المستخدم
  isUserMenuOpen = signal<boolean>(false);

  // قيمة البحث
  searchValue = signal<string>('');

  searchPlaceholder = input<string>('Search...')

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

  // إغلاق القوائم عند النقر خارجها
  closeAllMenus() {
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
    this.isMoreOpen.set(false)
  }

  // ====================================================================

  visibleNavItems = computed<NavbarItem[]>(() => {
    if (this.showSearchBar()) {
      return this.navItems().slice(0, 2).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
    }
    return this.navItems().slice(0, 5).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
  });

  moreNavItems = computed<NavbarItem[]>(() => {
    if (this.showSearchBar()) {
      return this.navItems().slice(2).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
    }
    return this.navItems().slice(5).map((n: NavbarItemExport) => this.toNavbarItem(n, true));
  });

  isMoreOpen = signal(false)

  mobileNavItems = computed<NavbarItem[]>(() => 
    this.navItems().map((n: NavbarItemExport) => this.toNavbarItem(n, false))
  );

  getUserMenuItems = computed<NavbarItem[]>(() => 
    this.userMenuItems().map((n: NavbarItemExport) => this.toNavbarItem(n, false))
  );

  private toNavbarItem(item: NavbarItemExport, childrenOpenWindow = false): NavbarItem {
    return {
      ...item,
      childrenOpenWindow,
      children: item.children?.map(child => this.toNavbarItem(child, childrenOpenWindow)) ?? []
    };
  }

  // ====================================================================

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

  // ==================================================================== 

  itemClicked(event: NavbarItem) {
    this.closeAllMenus()
  }
}
