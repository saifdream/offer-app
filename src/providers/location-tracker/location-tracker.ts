import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/filter';

@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation, 
    public geolocation: Geolocation, public http: HttpClient, public platform: Platform, public events: Events) {
      console.log("LocationTrackerProvider");
  }

  startBackgroundTracking() {
    let config = {
      locationProvider: 1,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      notificationTitle: "Keep device GPS ON",
      notificationText: "Foodoli is running in background",
      stopOnTerminate: false,
      startOnBoot: true,
      startForeground: true,
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 5000,
      pauseLocationUpdates: false,
      maxLocations: 1
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      //this.backgroundGeolocation.finish();
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.events.publish('user:change', location, Date.now());
      });
    }, (err) => {
      console.log(err);
    });
    
    //this.backgroundGeolocation.start();
    this.backgroundGeolocation.isLocationEnabled()
    .then((rta) => {
      if (rta) {
          this.backgroundGeolocation.start();
          this.backgroundGeolocation.finish();
          this.backgroundGeolocation.stop();
        } else {
          this.backgroundGeolocation.showLocationSettings();
        }
      });
  }

  stopBackgorundTracking() {
    console.log('stopBackgorundTracking');
    this.backgroundGeolocation.finish();
    this.backgroundGeolocation.stop();
  }

  startForegroundTracking() {
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      console.log(position);
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.events.publish('user:change', position.coords, Date.now());
      });
    });
  }

  stopForegroundTracking() {
    this.watch.unsubscribe();
  }
}
