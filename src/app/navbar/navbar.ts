import { Component, signal } from '@angular/core';
import { Znavbar, UserProfile } from '../znavbar/znavbar';
import { NavbarItem } from '../znav-items/znav-items';

@Component({
  selector: 'app-navbar',
  imports: [Znavbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  logoUrl = 'https://i.postimg.cc/rsCB0PfM/android-chrome-512x512.png';
  isLoggedIn = signal(false);

  navItems: NavbarItem[] = [
    { label: 'Products', routerLink: '/products' },
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
    { label: 'Profile', routerLink: '/profile' },
    { label: 'Cart', routerLink: '/cart' },
    { label: 'Orders', routerLink: '/orders' },
    { label: 'Addresses', routerLink: '/addresses' },
    { label: 'Reviews', routerLink: '/reviews' },
    { 
      label: 'Logout', 
      action: () => this.logout(),
      textColor: 'text-red-700',
      icon: 'fas fa-sign-out-alt text-red-700 text-lg'
    }
  ];

  onLogin() {
    console.log('Login clicked');
    this.isLoggedIn.set(true);
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
  }
}
