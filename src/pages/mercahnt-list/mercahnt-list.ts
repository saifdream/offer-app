import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Events } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { ImageUrl } from '../common';
import { PorductListPage } from '../porduct-list/porduct-list';

@Component({
  selector: 'page-mercahnt-list',
  templateUrl: 'mercahnt-list.html',
})
export class MercahntListPage {
  category: any;
  merchants: any;
  imgUrl: string;
  lat: number = 0;
  lng: number = 0;
  isEmpty: boolean = true;
  refresher: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public locationTracker: LocationTrackerProvider,
    public platform: Platform, public events: Events, public api: ApiServiceProvider) {
      this.imgUrl = ImageUrl;
      this.category = this.navParams.get('category');
      events.subscribe('user:change', (location, time) => {
        console.log(location)
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.getMerchantList();
      });
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    this.startTracking();
  }

  ionViewWillEnter() {
    this.getList();
  }

  doRefresh(refresher) {
    this.refresher = refresher;
    this.getList();
  }

  getMerchantList() {
    this.api._getWithOutLoader('merchant/listByLatLng/' + this.category['id'] + '/' + this.lat + '/' + this.lng)
    .then(result=>{
      console.log(result)
      this.merchants = result;
      this.isEmpty = Object.keys(result).length <= 0 ? true : false; 
    }).catch(error=>{
      console.log(error);
    })
  }

  getList() {
    this.api._get('merchant/listByLatLng/' + this.category['id'] + '/' + this.lat + '/' + this.lng)
    .then(result=>{
      if(this.refresher)
        this.refresher.complete();
      console.log(result)
      this.merchants = result;
      this.isEmpty = Object.keys(result).length <= 0 ? true : false; 
    }).catch(error=>{
      if(this.refresher)
        this.refresher.complete();
      console.log(error);
    })
  }

  ionViewWillLeave() {
    this.stopTracking();
  }

  goToProductList(merchant) {
    this.navCtrl.push(PorductListPage, {merchant: merchant});
  }

  startTracking() {
    this.locationTracker.startForegroundTracking();
    if (this.platform.is('cordova')) {
      this.locationTracker.startBackgroundTracking();
    }
  }

  stopTracking() {
    this.locationTracker.stopForegroundTracking();
    if (this.platform.is('cordova')) {
      this.locationTracker.stopBackgorundTracking();
    }
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  getDistanceFromLatLonInKm(lat, lon) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat - this.lat);  // deg2rad below
    var dLon = this.deg2rad(lon - this.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this.lat)) * Math.cos(this.deg2rad(lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }
}
