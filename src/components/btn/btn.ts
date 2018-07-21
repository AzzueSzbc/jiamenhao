import { Component } from '@angular/core';

/**
 * Generated class for the BtnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'btn',
  templateUrl: 'btn.html'
})
export class BtnComponent {

  text: string;

  constructor() {
    console.log('Hello BtnComponent Component');
    this.text = 'Hello World';
  }

}
