import { Component } from '@angular/core';

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
