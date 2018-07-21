import { Component } from '@angular/core';

/**
 * Generated class for the IconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'icon',
  templateUrl: 'icon.html'
})
export class IconComponent {

  text: string;

  constructor() {
    console.log('Hello IconComponent Component');
    this.text = 'Hello World';
  }

}
