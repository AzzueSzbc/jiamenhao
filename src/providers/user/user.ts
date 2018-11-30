import { Injectable } from '@angular/core';
import { BuyerAccountManagementProvider } from './buyer-account-management';
import { CouponProvider } from './buyer-coupon';
import { ShippingAddressProvider } from './buyer-shipping-address';

//import { PostBuyerAccount } from '../config';
//import { PostBuyerShippingAddressID } from '../config';
//import { PostBuyerShippingAddress } from '../config';

//获得买家基本信息
//getBuyerBasicInformation.php
/*
发送：
{
    userID:买家ID,
    token:买家token
}
 */
//interface PostGetBuyerBasicInformation extends PostBuyerAccount {}

//查询优惠券
//getCoupon.php
/*
发送：
{
    userID:买家ID,
    token:买家token
}
 */
//interface PostGetCoupon extends PostBuyerAccount {}

//查询收货地址信息（使用地址信息ID）
//getShippingAddressByID_buyer.php
/*
发送：
{
    "userID":买家ID,
    "token":买家token,
    "buyerShippingAddressID":收货地址信息ID
}
 */
//interface PostGetShippingAddressByID extends PostBuyerAccount,PostBuyerShippingAddressID {}

//查询买家所有收货地址
//getBuyerShippingAddress.php
/*
发送：
{
    "userID":买家ID,
    "token":买家token,
}
 */
//interface PostGetBuyerShippingAddress extends PostBuyerAccount {}

//增加买家收货地址
//addNewShippingAddress_buyer.php
/*
发送：
{
    "buyerID":买家ID,
    "token":买家token,
    //一次只增加一条地址，多条收货地址需要多次调用此PHP
    "consigneeAddress":收货人地址,
    "consigneeName":收货人姓名,
    "consigneeGender":收货人性别,
    "consigneePhoneNumber":收货人电话号码
}
 */
//interface PostAddNewShippingAddress extends PostBuyerAccount,PostBuyerShippingAddress {}

//修改买家收货地址
//buyerModifyShippingAddress.php
/*
发送：
{
    "buyerID":买家ID,
    "token":买家token,
    "buyerShippingAddressID":收货地址ID,
    "consigneeAddress":收货人地址,
    "consigneeName":收货人姓名,
    "consigneeGender":收货人性别,
    "consigneePhoneNumber":收货人电话号码
}
 */
//interface PostModifyShippingAddress extends PostBuyerAccount,PostBuyerShippingAddressID,PostBuyerShippingAddress {}

@Injectable()
export class UserProvider {

  constructor(
    private accountManagement: BuyerAccountManagementProvider,
    private coupon: CouponProvider,
    private shippingAddress: ShippingAddressProvider,
  ) {}

  /**
   * 获得买家基本信息
   */
  public getUserBasicData(userID: number,token: string) {
    let post = {
      userID: userID,
      token: token
    }
    return this.accountManagement.getBuyerBasicInformation(post);
  }

  /**
   * 查询优惠券
   */
  public getCoupon(userID: number,token: string) {
    let post = {
      userID: userID,
      token: token
    }
    return this.coupon.getCoupon(post);
  }

  /**
   * 查询单个收货地址信息（使用地址信息ID）
   */
  public getOneShippingAddress(userID: number,token: string,buyerShippingAddressID: number) {
    let post = {
      userID: userID,
      token:  token,
      buyerShippingAddressID: buyerShippingAddressID
    }
    return this.shippingAddress.getShippingAddressByID(post);
  }

  /**
   * 查询买家所有收货地址
   */
  public getAllShippingAddress(userID: number,token: string) {
    let post = {
      userID: userID,
      token:  token,
    }
    return this.shippingAddress.getBuyerShippingAddress(post);
  }

  /**
   * 增加买家收货地址
   */
  public addNewShippingAddress(
    userID: number,
    token: string,
    consigneeAddress: string,
    consigneeName:  string,
    consigneeGender: string,
    consigneePhoneNumber: string
  ) {
    let post = {
      userID: userID,
      token: token,
      consigneeAddress: consigneeAddress,
      consigneeName:  consigneeName,
      consigneeGender: consigneeGender,
      consigneePhoneNumber: consigneePhoneNumber
    }
    return this.shippingAddress.addNewShippingAddress(post);
  }

  /**
   * 修改买家收货地址
   */
  public modifyShippingAddress(
    userID: number,
    token: string,
    buyerShippingAddressID: number,
    consigneeAddress: string,
    consigneeName:  string,
    consigneeGender: string,
    consigneePhoneNumber: string
  ) {
    let post = {
      userID: userID,
      token: token,
      buyerShippingAddressID: buyerShippingAddressID,
      consigneeAddress: consigneeAddress,
      consigneeName:  consigneeName,
      consigneeGender: consigneeGender,
      consigneePhoneNumber: consigneePhoneNumber
    }
    return this.shippingAddress.buyerModifyShippingAddress(post);
  }
}
