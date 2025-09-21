import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZnavItems, NavbarItem } from '../znav-items/znav-items';

export interface UserProfile {
  name: string;
  imageUrl?: string;
  email?: string;
}

@Component({
  selector: 'app-znavbar',
  imports: [RouterModule, CommonModule, ZnavItems],
  templateUrl: './znavbar.html',
  styleUrl: './znavbar.css'
})
export class Znavbar {
  // الإدخالات القابلة للتخصيص
  logoUrl = input<string | undefined>();
  siteName = input<string | undefined>();

  showAuthButtons = input<boolean>(true);
  showSearchBar = input<boolean>(false);

  navItems = input<NavbarItem[]>([]);

  isLoggedIn = input<boolean>(false);
  userProfile = input<UserProfile | undefined>();

  userMenuItems = input<NavbarItem[]>([]);

  // الأحداث الصادرة
  loginClicked = output<void>();
  signupClicked = output<void>();
  searchSubmitted = output<string>();

  // حالة القائمة المتنقلة (للشاشات الصغيرة)
  isMobileMenuOpen = signal(false);

  // حالة قائمة المستخدم
  isUserMenuOpen = signal(false);

  // قيمة البحث
  searchValue = signal('');

  // دالة للبحث
  onSearchSubmit() {
    this.searchSubmitted.emit(this.searchValue());
  }

  // دالة لتسجيل الدخول
  onLogin() {
    this.loginClicked.emit();
  }

  // دالة للتسجيل
  onSignup() {
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
  }

  // ====================================================================

  openIndex = signal<number | null | undefined>(null);
  openIndexUser = signal<number | null | undefined>(null);

  visibleNavItems = computed(() => {
    if(this.showSearchBar()) return this.navItems().slice(0, 2)
    return this.navItems().slice(0, 5)
  });
  moreNavItems = computed(() => {
    if(this.showSearchBar()) return this.navItems().slice(2)
    return this.navItems().slice(5)
  });
  isMoreOpen = signal(false)

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
}
