import { Component } from '@angular/core';

/**
 * Generated class for the SplitComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'split',
  templateUrl: 'split.html'
})
export class SplitComponent {

  text: string;

  constructor() {
    console.log('Hello SplitComponent Component');
    this.text = 'Hello World';
  }

}
