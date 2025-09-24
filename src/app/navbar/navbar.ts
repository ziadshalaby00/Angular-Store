import { Component, inject, signal } from '@angular/core';
import { Znavbar, NavbarItemExport , UserProfile } from '../ZiadShalaby/zui-comp/znavbar/znavbar';
import { ZalertService } from '../ZiadShalaby/zui-comp/zalertService/zalert-service';

@Component({
  selector: 'app-navbar',
  imports: [Znavbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  alertService: ZalertService = inject(ZalertService)

  logoUrl: string = 'https://i.postimg.cc/rsCB0PfM/android-chrome-512x512.png';
  isLoggedIn = signal<boolean>(true);

  navItems: NavbarItemExport[] = [
    { 
      label: 'Test', 
      routerLink: '/test', 
      iconClass: 'fa-solid fa-vial text-lg', 
      textColorClass: "text-green-700", 
      hoverType: 'text',
      hoverTextColorClass: 'hover:text-green-800 dark:hover:text-green-600' 
    },
    { label: 'Products', routerLink: '/products', iconClass: 'fas fa-tag text-lg', hoverType: 'text' },
    { label: 'Cart', routerLink: '/cart', iconClass: 'fas fa-shopping-cart text-blue-700 text-lg', hoverType: 'text' },
    { label: 'About Us', routerLink: '/about', hoverType: 'text'},
    { label: 'Contact Us', routerLink: '/contact', hoverType: 'text'},
    {
      label: 'Legal Pages',
      hoverType: 'text',
      children: [
        { label: 'Privacy Policy', routerLink: '/privacyPolicy', hoverType: 'bg'},
        { label: 'Terms & Conditions', routerLink: '/termsConditions', hoverType: 'bg'},
      ]
    },
  ];

  userProfile: UserProfile = {
    name: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
  };

  userMenuItems: NavbarItemExport[] = [
    { label: 'Profile', routerLink: '/profile', iconClass: 'fa-solid fa-user text-lg', hoverType: 'text' },
    { 
      label: 'Cart', 
      routerLink: '/cart', 
      iconClass: 'fas fa-shopping-cart text-lg text-blue-700', 
      hoverType: 'text'
    },
    { 
      label: 'Dashboard', 
      iconClass: 'fa-solid fa-gear',
      hoverType: 'text',
      children: [
        { 
          label: 'Orders', 
          routerLink: '/orders', 
          iconClass: 'fas fa-box text-lg text-indigo-500',
          hoverType: 'bg'
        },
        { label: 'Addresses', routerLink: '/addresses', iconClass: 'fa-solid fa-location-dot text-lg', hoverType: 'bg' },
        { label: 'Reviews', routerLink: '/reviews', iconClass: 'fa-solid fa-star text-lg', hoverType: 'bg' },
      ]
    },
    { 
      label: 'Logout', 
      action: () => this.logout(),
      textColorClass: 'text-red-700',
      iconClass: 'fas fa-sign-out-alt text-lg',
      hoverType: 'text',
      hoverTextColorClass: 'hover:text-red-800 dark:hover:text-red-600'
    }
  ];

  onLogin() {
    console.log('Login clicked');
    this.isLoggedIn.set(true);

    this.alertService.addAlert({
      message: 'Logged in successfully',
      type: 'success'
    })
  }

  onSignup() {
    console.log('Signup clicked');
  }

  onSearch(query: string) {
    console.log('Search for:', query);
  }

  logout() {
    this.isLoggedIn.set(false);
    console.log('Logged out');

    this.alertService.addAlert({
      message: 'Logged out successfully',
      type: 'danger'
    })
  }
}
