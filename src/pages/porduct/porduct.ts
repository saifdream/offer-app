import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ActionSheetController, Platform, normalizeURL } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

@Component({
  selector: 'page-porduct',
  templateUrl: 'porduct.html',
})
export class PorductPage {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  files: any = [];
  merchants: any;
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
        productPic: [''],
        categoryId: ['', Validators.required],
        merchantId: ['', Validators.required],
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        size: ['', Validators.required],
        color: ['', Validators.required],
        qty: ['', Validators.required],
        isHighlighted: [false, Validators.required],
        isTrending: [false, Validators.required],
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
      console.log(result)
      this.categories = result;
    }).catch(error=>{
      console.log(error);
    })
  }

  getMerchant(categoryId) {
    this.api._getWithOutLoader("merchant/list/"+categoryId)
    .then(result=>{
      console.log(result)
      this.merchants = result;
    }).catch(error=>{
      console.log(error);
    })
  }

  addProduct() {
    let formData = new FormData();
    formData.append('merchant_id', this.form.value.merchantId);
    formData.append('name', this.form.value.name.trim());
    formData.append('description', this.form.value.description.trim());
    formData.append('price', this.form.value.price.trim());
    formData.append('size', this.form.value.size);
    formData.append('color', this.form.value.color);
    formData.append('qty', this.form.value.qty.trim());
    const isHighlighted = this.form.get('isHighlighted').value === true ? 1 : 0;
    formData.append('isHighlighted',  <string><any>isHighlighted);
    const isTrending = this.form.get('isTrending').value === true ? 1 : 0;
    formData.append('isTrending',  <string><any>isTrending);
    const isActive = this.form.get('isActive').value === true ? 1 : 0;
    formData.append('isActive',  <string><any>isActive);
    formData.append('image', this.files);
    this.api._add(formData, "product/create").then(
      (result) => {
        console.log(result)
        this.form.reset();
      }, 
      (err) => {
      console.log(err);
    });
  }
  
  getProduct() {
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
                this.form.patchValue({ 'productPic': 'data:image/jpg;base64,' + normalizeURL(data) });
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
              this.form.patchValue({ 'productPic': 'data:image/jpg;base64,' + normalizeURL(data) });
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
          this.form.patchValue({ 'productPic': imageData });
        };
        this.files = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
      } catch (e) {
        console.log(e)
      }
    }
  }

  getProductImageStyle() {
    return 'url(' + this.form.controls['productPic'].value + ')'
  }
}
