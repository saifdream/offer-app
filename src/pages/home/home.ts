import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImageUrl } from '../common';
import { MercahntListPage } from '../mercahnt-list/mercahnt-list';
import { PorductDetailsPage } from '../porduct-details/porduct-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  categories: any;
  imgUrl: string;
  highlighted: any;
  trending: any;
  refresher: any;
  isCategoryEmpty: boolean = true;
  isHighlightEmpty: boolean = true;
  isTrendingEmpty: boolean = true;
  constructor(public navCtrl: NavController, public api: ApiServiceProvider) {
    this.imgUrl = ImageUrl;
  }

  ionViewDidEnter() {
    this.getCategory();
  }
  
  getCategory() {
    this.api._get("category/list_product")
    .then(result=>{
      if(result) {
        if(this.refresher)
          this.refresher.complete();
        console.log(result)
        this.categories = result['categories'];
        this.isCategoryEmpty = Object.keys(result['categories']).length <= 0 ? true : false; 
        this.highlighted = result['highlighted'];
        this.isHighlightEmpty = Object.keys(result['highlighted']).length <= 0 ? true : false; 
        this.trending = result['trending'];
        this.isTrendingEmpty = Object.keys(result['trending']).length <= 0 ? true : false;
      }
    }).catch(error=>{
      if(this.refresher)
        this.refresher.complete();
      console.log(error);
    })
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getCategory();
  }

  goToMerchantList(category) {
    this.navCtrl.push(MercahntListPage, {category: category});
  }

  goToProductDetails(product) {
    this.navCtrl.push(PorductDetailsPage, {product: product});
  }
}
