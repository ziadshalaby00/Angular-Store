import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Zspinner } from '../ZiadShalaby/zui-comp/zspinner/zspinner';

@Component({
  selector: 'app-test',
  imports: [CommonModule, Zspinner],
  templateUrl: './test.html',
  styleUrl: './test.css'
})
export class Test {

}
