import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ActionSheetController, Platform, normalizeURL } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@Component({
  selector: 'page-mercahnt',
  templateUrl: 'mercahnt.html',
})
export class MercahntPage {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  files: any = [];
  categories: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController, 
    public modalCtrl:ModalController,
    public formBuilder: FormBuilder, 
    private camera: Camera, public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public api: ApiServiceProvider) {

      this.form = formBuilder.group({
        mercahntPic: [''],
        categoryId: ['', Validators.required],
        name: ['', Validators.required],
        address: ['', Validators.required],
        contact: ['', Validators.required],
        email: ['', Validators.required],
        web: ['', Validators.required],
        lat: ['', Validators.required],
        lng: ['', Validators.required],
        isActive: [false, Validators.required]
      });
      
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidEnter() {
    this.getCategory();
  }

  getCategory() {
    this.api._get("category/list")
    .then(result=>{
      this.categories = result;
    }).catch(error=>{
      console.log(error);
    })
  }

  addMercahnt() {
    let formData = new FormData();
    formData.append('category_id', this.form.value.categoryId);
    formData.append('name', this.form.value.name.trim());
    formData.append('address', this.form.value.address.trim());
    formData.append('contact', this.form.value.contact.trim());
    formData.append('email', this.form.value.email.trim());
    formData.append('web', this.form.value.web.trim());
    formData.append('lat', this.form.value.lat.trim());
    formData.append('lng', this.form.value.lng.trim());
    const isActive = this.form.get('isActive').value === true ? 1 : 0;
    formData.append('isActive',  <string><any>isActive);
    formData.append('logo', this.files);
    this.api._add(formData, "mercahnt/create").then(
      (result) => {
        console.log(result)
        this.form.reset();
      }, 
      (err) => {
      console.log(err);
    });
  }
  
  getMercahnt() {
    if (this.platform.is('cordova')) {
      this.fileInput.nativeElement.click();
      return;
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose an option',
      buttons: [
        {
          text: 'Take a Picture',
          icon: 'camera',
          handler: () => {
            if (Camera['installed']()) {
              this.camera.getPicture({
                quality: 100,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                targetWidth: 96,
                targetHeight: 96
              }).then((data) => {
                this.form.patchValue({ 'mercahntPic': 'data:image/jpg;base64,' + normalizeURL(data) });
              }, (err) => {
                this.api.showToast("You aren't take any picture", "top");
              })
            } else {
              this.fileInput.nativeElement.click();
            }
          }
        }, {
          text: 'Choose an Image',
          icon: 'images',
          handler: () => {
            this.camera.getPicture({
              quality: 100,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
              targetWidth: 96,
              targetHeight: 96,
            }).then((data) => {
              this.form.patchValue({ 'mercahntPic': 'data:image/jpg;base64,' + normalizeURL(data) });
            }, (err) => {
              this.fileInput.nativeElement.click();
            })
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
  }
  processWebImage(event) {
    if (event.target.value) {
      try {
        let reader = new FileReader();
        reader.onload = (readerEvent) => {
          let imageData = (readerEvent.target as any).result;
          this.form.patchValue({ 'mercahntPic': imageData });
        };
        this.files = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
      } catch (e) {
        console.log(e)
      }
    }
  }

  getMercahntImageStyle() {
    return 'url(' + this.form.controls['mercahntPic'].value + ')'
  }
}
