import { CommonModule } from '@angular/common';
import { Component, input, output, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface NavbarItem {
  label: string;
  routerLink?: string;
  action?: () => void;
  children?: NavbarItem[];
  textColor?: string,
  icon?: string
}
export interface UserProfile {
  name: string;
  imageUrl?: string;
  email?: string;
}

@Component({
  selector: 'app-znavbar',
  imports: [RouterModule, CommonModule],
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

  toggleChildren: Map<number, WritableSignal<boolean>> = new Map();
  
  toggleChild(index: number) {
    if (!this.toggleChildren.has(index)) {
      this.toggleChildren.set(index, signal(true));
    } else {
      const childSignal = this.toggleChildren.get(index)!;
      childSignal.set(!childSignal());
    }
  }

  // دالة للحصول على حالة عنصر
  isChildOpen(index: number) {
    if (!this.toggleChildren.has(index)) {
      this.toggleChildren.set(index, signal(false));
    }
    return this.toggleChildren.get(index)!();
  }
}
