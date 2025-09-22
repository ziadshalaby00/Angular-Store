import { Component, inject, signal } from '@angular/core';
import { Znavbar, UserProfile } from '../ZiadShalaby/zui-comp/znavbar/znavbar';
import { NavbarItem } from '../ZiadShalaby/zui-comp/znav-items/znav-items';
import { ZalertService } from '../ZiadShalaby/zui-comp/zalertService/zalert-service';

@Component({
  selector: 'app-navbar',
  imports: [Znavbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  alertService = inject(ZalertService)

  logoUrl = 'https://i.postimg.cc/rsCB0PfM/android-chrome-512x512.png';
  isLoggedIn = signal(true);

  navItems: NavbarItem[] = [
    { label: 'Test', routerLink: '/test', icon: 'fa-solid fa-vial text-lg', textColor: "text-green-700", hoverColor: 'hover:text-green-800 dark:hover:text-green-600' },
    { label: 'Products', routerLink: '/products', icon: 'fas fa-tag text-lg' },
    { label: 'Cart', routerLink: '/cart', icon: 'fas fa-shopping-cart text-blue-700 text-lg' },
    { label: 'About Us', routerLink: '/about'},
    { label: 'Contact Us', routerLink: '/contact'},
    {
      label: 'Legal Pages',
      children: [
        { label: 'Privacy Policy', routerLink: '/privacyPolicy'},
        { label: 'Terms & Conditions', routerLink: '/termsConditions'},
      ]
    },
  ];

  userProfile: UserProfile = {
    name: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
  };

  userMenuItems: NavbarItem[] = [
    { label: 'Profile', routerLink: '/profile', icon: 'fa-solid fa-user text-lg' },
    { 
      label: 'Cart', 
      routerLink: '/cart', 
      icon: 'fas fa-shopping-cart text-lg text-blue-700', 
    },
    { 
      label: 'Dashboard', 
      icon: 'fa-solid fa-gear',
      children: [
        { 
          label: 'Orders', 
          routerLink: '/orders', 
          icon: 'fas fa-box text-lg text-indigo-500',
          textColor: '',
        },
        { label: 'Addresses', routerLink: '/addresses', icon: 'fa-solid fa-location-dot text-lg' },
        { label: 'Reviews', routerLink: '/reviews', icon: 'fa-solid fa-star text-lg' },
      ]
    },
    { 
      label: 'Logout', 
      action: () => this.logout(),
      textColor: 'text-red-700',
      icon: 'fas fa-sign-out-alt text-lg',
      hoverColor: 'hover:text-red-500'
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
