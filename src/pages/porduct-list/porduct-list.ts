import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { PorductDetailsPage } from './../porduct-details/porduct-details';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ImageUrl } from '../common';

@Component({
  selector: 'page-porduct-list',
  templateUrl: 'porduct-list.html',
})
export class PorductListPage {
  merchant: any;
  refresher: any;
  products: any;
  imgUrl: string;
  isEmpty: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiServiceProvider) {
    this.imgUrl = ImageUrl;
    this.merchant = this.navParams.get('merchant');
  }

  ionViewWillEnter() {
    this.isEmpty = true;
    this.getProductList();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getProductList();
  }
  
  getProductList() {
    this.api._get('product/list/' + this.merchant['id'])
    .then(result=>{
      if(this.refresher)
        this.refresher.complete();
      console.log(result)
      this.products = result;
      this.isEmpty = Object.keys(result).length <= 0 ? true : false; 
    })
    .catch(error=>{
      if(this.refresher)
        this.refresher.complete();
      console.log(error)
    })
  }

  goToProductDetails(product) {
    this.navCtrl.push(PorductDetailsPage, {product: product});
  }
}
