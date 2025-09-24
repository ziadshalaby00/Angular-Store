import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { ZnavItems, NavbarItem } from '../ZiadShalaby/zui-comp/znav-items/znav-items';

@Component({
  selector: 'app-test',
  imports: [CommonModule, ZnavItems],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {
  anyItemClicked(event: string) {
    console.log(event)
  }
  navItem = signal<NavbarItem>({
      label: 'الرئيسية',
      childrenOpenWindow: true,
      children: [
        {
          label: 'الالخدماتالخدماتالخدماتالخدماتخدمات',
          childrenOpenWindow: true,
          children: [
            {
              label: 'تصميم مواقع',
              childrenOpenWindow: false,
              children: [
                {
                  label: 'Frontend',
                  childrenOpenWindow: false,
                },
                {
                  label: 'Backend',
                  childrenOpenWindow: false,
                  children: [
                    {
                      label: 'Node.js',
                      childrenOpenWindow: false,
                    },
                    {
                      label: 'Django',
                      childrenOpenWindow: false,
                    }
                  ]
                }
              ]
            },
            {
              label: 'تسويق رقمي',
              childrenOpenWindow: false,
            }
          ]
        },
        {
          label: 'عن الشركة',
          childrenOpenWindow: false,
          children: [
            {
              label: 'فريق العمل',
              childrenOpenWindow: false,
            },
            {
              label: 'قصتنا',
              childrenOpenWindow: false,
            }
          ]
        },
        {
          label: 'تواصل معنا',
          childrenOpenWindow: false,
        }
      ]
    })
}
