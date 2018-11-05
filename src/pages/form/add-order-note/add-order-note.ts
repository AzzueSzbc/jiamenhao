import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-order-note',
  templateUrl: 'add-order-note.html',
})
export class AddOrderNotePage {

  noteForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder) {
      let note: string = this.navParams.get('note');
      this.noteForm = this.formBuilder.group({
        note : [note],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddOrderNotePage');
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 complete() {
   let data = { 'note': this.noteForm.value.note };
   this.viewCtrl.dismiss(data);
 }

}
