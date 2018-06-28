import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry, map } from 'rxjs/operators';

import { APP_SERVE_URL } from '../config';

export interface query {
  querySuccess: boolean;
  queryResult: any;
}

export interface queryNoData {
  querySuccess: boolean;
}

@Injectable()
export class HermesProvider {

  constructor(public http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private storage: Storage) {
    console.log('Hello HermesProvider Provider');
  }

  public hermes(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
              .pipe(
                retry(3),
                catchError(this.handleError)
              );
  }

  public hermesQuery(link, post): Observable<query> {
    return this.http.post<query>(APP_SERVE_URL + link, JSON.stringify(post))
              .pipe(
                retry(3),
                catchError(this.handleError)
              );
  }

  public hermesQueryNoData(link, post): Observable<queryNoData> {
    return this.http.post<queryNoData>(APP_SERVE_URL + link, JSON.stringify(post))
              .pipe(
                retry(3),
                catchError(this.handleError)
              );
  }

  public hermesResponse(link, post): Observable<HttpResponse<any>> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post), { observe: 'response' });
  }

  public hermesQueryResponse(link, post): Observable<HttpResponse<query>> {
    return this.http.post<query>(APP_SERVE_URL + link, JSON.stringify(post), { observe: 'response' });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

  public presentAlert(title:string, message:string, buttons:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [buttons]
    });
    alert.present();
  }

  public presentToast(message, duration:number, position:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
