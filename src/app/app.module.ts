import { LocationTrackerProvider } from './../providers/location-tracker/location-tracker';
import { MercahntListPage } from './../pages/mercahnt-list/mercahnt-list';
import { MercahntPage } from './../pages/mercahnt/mercahnt';
import { CategoryListPage } from './../pages/category-list/category-list';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoryPage } from '../pages/category/category';
import { PorductPage } from '../pages/porduct/porduct';
import { PorductListPage } from '../pages/porduct-list/porduct-list';

import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { HttpClientModule } from '@angular/common/http';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { PorductDetailsPage } from '../pages/porduct-details/porduct-details';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CategoryPage,
    CategoryListPage,
    MercahntPage,
    MercahntListPage,
    PorductPage,
    PorductListPage,
    PorductDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CategoryPage,
    CategoryListPage,
    MercahntPage,
    MercahntListPage,
    PorductPage,
    PorductListPage,
    PorductDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,
    BackgroundGeolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationTrackerProvider,
    ApiServiceProvider
  ]
})
export class AppModule {}
