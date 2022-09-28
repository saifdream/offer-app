import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Domain } from '../../pages/common';
import { LoadingController, ToastController, Loading } from 'ionic-angular';

@Injectable()
export class ApiServiceProvider {
  loaderStatus: boolean;
  loading: Loading;

  constructor(public http: HttpClient, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {}

  _add(data, url) {
    this.showLoading();
    return new Promise((resolve, reject) => {
      this.http.post(Domain + url, data, { headers: new HttpHeaders().set('Authorization', 'Bearer ') })
        .subscribe(res => {
          if (res) {
            this.showToast(res['message'], 'top');
          }
          this.hideLoading();
          resolve(res);
        }, (err) => {
          this.hideLoading();
          this.showToast(err.statusText, 'top');
          reject(err);
        });
    });
  }

  _update(data, url) {
    this.showLoading();
    return new Promise((resolve, reject) => {
      this.http.post(Domain + url, data, { headers: new HttpHeaders().set('Authorization', 'Bearer ') })
        .subscribe(res => {
          if (res) {
            this.showToast(res['message'], 'top');
          }
          this.hideLoading();
          resolve(res);
        }, (err) => {
          this.hideLoading();
          this.showToast(err.statusText, 'top');
          reject(err);
        });
    });
  }

  _postWithOutLoader(data, url) {
    return new Promise((resolve, reject) => {
      this.http.post(Domain + url, data, { headers: new HttpHeaders().set('Authorization', 'Bearer ') })
        .subscribe(res => {
          if (res) {
            this.showToast(res['message'], 'top');
          }
          resolve(res);
        }, (err) => {
          this.showToast(err.statusText, 'top');
          reject(err);
        });
    });
  }

  silentUpdate(data, url) {
    return new Promise((resolve, reject) => {
      this.http.post(Domain + url, data, { headers: new HttpHeaders().set('Authorization', 'Bearer ') })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  _get(url) {
    this.showLoading();
    return new Promise((resolve, reject) => {
      console.log(Domain + url)
      this.http.get(Domain + url, { headers: new HttpHeaders().set('Authorization', 'Bearer ') })
        .subscribe(res => {
          this.hideLoading();
          resolve(res);
        }, (err) => {
          this.hideLoading();
          this.showToast(err.statusText, 'top');
          reject(err);
        });
    });
  }

  _getWithOutLoader(url) {
    return new Promise((resolve, reject) => {
      console.log(Domain + url)
      this.http.get(Domain + url, { headers: new HttpHeaders().set('Authorization', 'Bearer ') })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          this.showToast(err.statusText, 'top');
          reject(err);
        });
    });
  }

  _getWithMassage(url) {
    this.showLoading();
    return new Promise((resolve, reject) => {
      console.log(Domain + url)
      this.http.get(Domain + url, { headers: new HttpHeaders().set('Authorization', 'Bearer ') })
        .subscribe(res => {
          this.hideLoading();
          if (res) {
            this.showToast(res['message'], 'top');
          }
          resolve(res);
        }, (err) => {
          this.hideLoading();
          this.showToast(err.statusText, 'top');
          reject(err);
        });
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: false
    });
    this.loading.present();
    this.loaderStatus = true;
    this.loading.onDidDismiss(() => {
      this.loaderStatus = false;
      console.log('Dismissed loading');
    });
  }

  hideLoading() {
    if (this.loaderStatus) {
      this.loading.dismiss();
    }
  }

  showToast(msg, position) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: position
    });
    toast.present();
  }

}
