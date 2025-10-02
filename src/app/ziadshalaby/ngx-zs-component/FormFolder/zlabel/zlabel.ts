import { Component, input } from '@angular/core';

@Component({
  selector: 'ZS-label',
  imports: [],
  templateUrl: './zlabel.html',
  styleUrl: './zlabel.css'
})
export class Zlabel {
  readonly label = input<string | null>(null)
  readonly hint = input<string | null>(null)
  readonly hintID = input<string | null>(null)
  readonly required = input<boolean>(false)
}
