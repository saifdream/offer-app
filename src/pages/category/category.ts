import { ApiServiceProvider } from './../../providers/api-service/api-service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ActionSheetController, Platform, normalizeURL } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  files: any = [];

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
        categoryPic: [''],
        name: ['', Validators.required],
        description: ['', Validators.required],
        isActive: [false, Validators.required]
      });
      
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewWillEnter() {}

  addCategory() {
    let formData = new FormData();
    formData.append('name', this.form.value.name.trim());
    formData.append('description', this.form.value.description.trim());
    const isActive = this.form.get('isActive').value === true ? 1 : 0;
    formData.append('isActive',  <string><any>isActive);
    formData.append('image', this.files);
    this.api._add(formData, "category/create").then(
      (result) => {
        console.log(result)
        this.form.reset();
      }, 
      (err) => {
      console.log(err);
    });
  }
  
  getCategory() {
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
                this.form.patchValue({ 'categoryPic': 'data:image/jpg;base64,' + normalizeURL(data) });
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
              this.form.patchValue({ 'categoryPic': 'data:image/jpg;base64,' + normalizeURL(data) });
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
          this.form.patchValue({ 'categoryPic': imageData });
        };
        this.files = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
      } catch (e) {
        console.log(e)
      }
    }
  }

  getCategoryImageStyle() {
    return 'url(' + this.form.controls['categoryPic'].value + ')'
  }
}
