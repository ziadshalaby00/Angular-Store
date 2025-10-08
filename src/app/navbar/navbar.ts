import { Component, inject, signal } from '@angular/core';
import { ZalertService } from '../ziadshalaby/ngx-zs-component/AlertFolder/zalertService/zalert-service';
import { Znavbar, NavbarItemExport, UserProfile, SiteNameConfigType, AuthButtonsType } from '../ziadshalaby/ngx-zs-component/znavbar/znavbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [Znavbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  alertService: ZalertService = inject(ZalertService)
  private router: Router = inject(Router)

  siteNameConfig: SiteNameConfigType = {
    siteName: 'Ziadera',
    siteNameColorClass: 'text-gray-800 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300'
  }

  authButtons:AuthButtonsType = {
    showAuthButtons: true,
    signup: {
      btnStyle: 'teal'
    }
  }

  logoUrl: string = 'https://i.postimg.cc/rsCB0PfM/android-chrome-512x512.png';
  isLoggedIn = signal<boolean>(false);

  navItems: NavbarItemExport[] = [
    { 
      label: 'Test', 
      routerLink: '/test', 
      iconClass: 'fa-solid fa-vial text-lg', 
      colorClass: `text-green-600 hover:text-green-700 dark:hover:text-green-500`, 
    },
    { label: 'Products', routerLink: '/products', iconClass: 'fas fa-tag text-lg'},
    { label: 'Cart', routerLink: '/cart', iconClass: 'fas fa-shopping-cart text-blue-700 dark:text-blue-500 text-lg'},
    { label: 'About Us', routerLink: '/about'},
    { label: 'Contact Us', routerLink: '/contact'},
    {
      label: 'Legal Pages',
      children: [
        { label: 'Privacy Policy', routerLink: '/privacyPolicy', useDefaultColorClass: 'bg' },
        { label: 'Terms & Conditions', routerLink: '/termsConditions', useDefaultColorClass: 'bg'},
      ]
    },
  ];

  userProfile: UserProfile = {
    name: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
  };

  userMenuItems: NavbarItemExport[] = [
    { label: 'Profile', routerLink: '/profile', iconClass: 'fa-solid fa-user text-lg'},
    { 
      label: 'Cart', 
      routerLink: '/cart', 
      iconClass: 'fas fa-shopping-cart text-lg text-blue-700 dark:text-blue-500', 
    },
    { 
      label: 'Dashboard', 
      iconClass: 'fa-solid fa-gear',
      children: [
        { 
          label: 'Orders', 
          routerLink: '/orders', 
          iconClass: 'fas fa-box text-lg text-indigo-500',
          useDefaultColorClass: 'bg'
        },
        { label: 'Addresses', routerLink: '/addresses', iconClass: 'fa-solid fa-location-dot text-lg', useDefaultColorClass: 'bg' },
        { label: 'Reviews', routerLink: '/reviews', iconClass: 'fa-solid fa-star text-lg', useDefaultColorClass: 'bg' },
      ]
    },
    { 
      label: 'Logout', 
      action: () => this.logout(),
      colorClass: 'text-red-700 hover:text-red-800 dark:hover:text-red-600',
      iconClass: 'fas fa-sign-out-alt text-lg',
    }
  ];

  onLogin() {
    console.log('Login clicked');
    this.isLoggedIn.set(true);

    this.alertService.addAlert({
      message: 'Logged in successfully',
      type: 'success',
      autoClose: false
    })
  }

  onSignup() {
    this.router.navigate(['/signup'])
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
      type: 'success'
    })
  }
}
