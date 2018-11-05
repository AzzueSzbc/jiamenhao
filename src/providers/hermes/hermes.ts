import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry, map } from 'rxjs/operators';

import { APP_SERVE_URL } from '../config';

@Injectable()
export class HermesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello HermesProvider Provider');
  }

  public hermes(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * 通用http请求封装
   * @method hermes_common
   * http返回:
   * systemStatus:{
   *      querySuccess:boolean（查询执行完毕的标记）
   *  },
   * businessStatus:{
   *      acceptableFormat:boolean（数据格式符合要求的标记）,
   *      tokenVerifyPassed:boolean（token验证通过的标记）,
   *      commodityIsSellable:boolean（商品可出售的标记）,
   *      inBusinessHours:boolean（商家营业中的标记）,
   *      securityCodeVerifyPassed:boolean（开始使用功能中，通过短信验证码验证的标记）,
   *      accountNotLocked:boolean（账号未被锁定的标记）,
   *      censorPassed:boolean（发布的文本、图像通过审查的标记）
   *  },
   * queryResult:{...}（查询结果）
   * @param  link             接收请求的php
   * @param  post             发送的数据
   * @return                  根据http返回的系统状态和业务状态判断返回状态提示字符串或返回查询数据
   */
  public hermes_common(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
      .pipe(
        map((data) => {
          console.log("data:", data);
          if (data != false && data != null) {
            if (data.businessStatus.tokenVerifyPassed in data && data.businessStatus.tokenVerifyPassed == false) {
              return "token过期";
            } else if (data.businessStatus.acceptableFormat in data && data.businessStatus.acceptableFormat == false) {
              return "违法发送";
            } else if (data.businessStatus.accountNotLocked in data && data.businessStatus.accountNotLocked == false) {
              return "账号被锁定";
            } else if (data.businessStatus.securityCodeVerifyPassed in data && data.businessStatus.securityCodeVerifyPassed == false) {
              return "验证码错误"
            } else if (data.businessStatus.commodityIsSellable in data && data.businessStatus.commodityIsSellable == false) {
              return "商品不可出售";
            } else if (data.businessStatus.inBusinessHours in data && data.businessStatus.inBusinessHours == false) {
              return "商家未营业";
            } else if (data.businessStatus.censorPassed in data && data.businessStatus.censorPassed == false) {
              return "审核未通过";
            } else if (data.systemStatus.querySuccess in data && data.systemStatus.querySuccess == false) {
              return "请求失败";
            } else if (data.queryResult in data) {
              return data.queryResult;
            } else if (data.businessStatus.querySuccess in data && data.systemStatus.querySuccess == true) {
              return "请求成功";
            } else {
              return "未知错误";
            }
          }
        }),
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * 数据查询类http请求封装
   * 此类请求主要格式为发送用户ID，用户token，查询的数据的ID
   * http返回:
   * systemStatus:{querySuccess:boolean（查询执行完毕的标记）},
   * businessStatus:{tokenVerifyPassed:boolean（token验证通过的标记）},
   * queryResult（查询获得的数据）
   * @method dataQuery
   * @param  link                             接收请求的php
   * @param  post                             发送的数据
   * @return                                  根据http返回的系统状态和业务状态判断返回状态提示字符串或返回查询数据
   */
  public dataQuery(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
      .pipe(
        map((data) => {
          //恶意攻击处理：
          //"用户ID"对应的用必须拥有"查询的数据ID"对应的查询数据。
          //如果发送了其他买家的"查询数据ID"，没有返回。
          if (data != false && data != null) {
            if (data.businessStatus.tokenVerifyPassed == true) {
              if (data.systemStatus.querySuccess == true) {
                return data.queryResult;
              } else if (data.systemStatus.querySuccess == false) {
                return "请求失败";
              }
            } else if (data.businessStatus.tokenVerifyPassed == false) {
              return "token过期";
            }
          }
        }),
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * 开放的数据查询类http封装
   * 此类请求主要格式为发送查询的数据ID，不需要用户token就可查询
   * http返回:
   * systemStatus:{querySuccess:boolean（查询执行完毕的标记）}
   * @method dataQuery_open
   * @param  link           接收请求的php
   * @param  post           发送的数据
   * @return                根据http返回的系统状态和业务状态判断返回状态提示字符串
   */
  public dataQuery_open(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
      .pipe(
        map((data) => {
          //恶意攻击处理：
          //数据库必须存在"查询的数据ID"对应的查询数据。
          //如果发送了不存在的"查询数据ID"，没有返回。
          if (data != false && data != null) {
            if (data.systemStatus.querySuccess == true) {
              return data.queryResult;
            } else if (data.systemStatus.querySuccess == false) {
              return "请求失败";
            }
          }
        }),
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * 数据更改类http请求封装
   * 此类请求主要格式为发送用户ID，用户token，需要更改数据的表单
   * http返回:
   * systemStatus:{querySuccess:boolean（查询执行完毕的标记）},
   * businessStatus:{tokenVerifyPassed:boolean（token验证通过的标记）,
   *                 tokenVerifyPassed:boolean（token验证通过的标记）}
   * @method DataChange
   * @param  link       接收请求的php
   * @param  post       发送的数据
   * @return            根据http返回的系统状态和业务状态判断返回状态提示字符串
   */
  public dataChange(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
      .pipe(
        map((data) => {
          if (data.businessStatus.tokenVerifyPassed == true) {
            if (data.businessStatus.acceptableFormat == true) {
              if (data.systemStatus.querySuccess == true) {
                return "请求成功";
              } else if (data.systemStatus.querySuccess == false) {
                return "请求失败"
              }
            } else if (data.businessStatus.acceptableFormat == false) {
              return "违法发送"
            }
          } else if (data.businessStatus.tokenVerifyPassed == false) {
            return "token过期"
          }
        }),
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * 向特定ID的数据需审查的数据更改类http请求封装
   * 此类请求主要格式为发送用户ID，用户token，需要更改数据的表单
   * http返回:
   * systemStatus:{querySuccess:boolean（查询执行完毕的标记）},
   * businessStatus:{tokenVerifyPassed:boolean（token验证通过的标记）,
   *                 tokenVerifyPassed:boolean（token验证通过的标记）,
   *                 censorPassed:boolean（发布的文本、图像通过审查的标记）}
   * @method dataChange_censor
   * @param  link              接收请求的php
   * @param  post              发送的数据
   * @return                   根据http返回的系统状态和业务状态判断返回状态提示字符串
   */
  public dataChange_censor(link, post): Observable<any> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post))
      .pipe(
        map((data) => {
          //恶意攻击处理：
          //"用户ID"对应的用必须拥有"查询的数据ID"对应的查询数据。
          //如果发送了其他买家的"查询数据ID"，没有返回。
          if (data != false && data != null) {
            if (data.businessStatus.tokenVerifyPassed == true) {
              if (data.businessStatus.acceptableFormat == true) {
                if (data.businessStatus.censorPassed == true) {
                  if (data.systemStatus.querySuccess == true) {
                    return "请求成功";
                  } else if (data.systemStatus.querySuccess == false) {
                    return "请求失败"
                  }
                } else if (data.businessStatus.censorPassed == false) {
                  return "未通过审查"
                }
              } else if (data.businessStatus.acceptableFormat == false) {
                return "违法发送"
              }
            } else if (data.businessStatus.tokenVerifyPassed == false) {
              return "token过期"
            }
          }
        }),
        retry(3),
        catchError(this.handleError)
      );
  }

  public hermesResponse(link, post): Observable<HttpResponse<any>> {
    return this.http.post<any>(APP_SERVE_URL + link, JSON.stringify(post), { observe: 'response' });
  }

  public hermesString(link, post): Observable<string> {
    return this.http.post(APP_SERVE_URL + link, JSON.stringify(post), { responseType: 'text' });
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

}
