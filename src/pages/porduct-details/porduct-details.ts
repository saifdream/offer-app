import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ImageUrl } from '../common';

@Component({
  selector: 'page-porduct-details',
  templateUrl: 'porduct-details.html',
})
export class PorductDetailsPage {
  product: any;
  imgUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.imgUrl = ImageUrl;
    this.product = this.navParams.get('product');
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad PorductDetailsPage');
  }

}
