import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry, map, tap } from 'rxjs/operators';

import { APP_SERVE_URL } from '../config';

@Injectable()
export class HermesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello HermesProvider Provider');
  }

  public _hermes(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  public hermes(link, post): Observable<any> {
    return this.http.post(APP_SERVE_URL + link, JSON.stringify(post), { responseType: 'text' }).pipe(
        map((data) => {
          console.log("data:", data);
          if (data) {
            let firstCode = data.charCodeAt(0);
            //console.log('response 0:' + firstCode);
            if (firstCode < 0x20 || firstCode > 0x7f) {
              //console.log('response get sp char');
              data = data.substring(1); // 去除第一个字符
              //console.log('response:' + data);
            }
            //console.log("parse:", JSON.parse(data));
            return JSON.parse(data);
          } else return null;
        }),
        retry(3),
        catchError(this.handleError),
    );
  }

  public hermesResponse(link, post): Observable<HttpResponse<any>> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post), { observe: 'response' }).pipe(
      tap((data) => {
        console.log("data:", data);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    //alert("err:" + JSON.stringify(error));
    console.log("err:", error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //alert('An error occurred:' + JSON.stringify(error.error.message));
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.log(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      /*alert(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);*/
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };

}
