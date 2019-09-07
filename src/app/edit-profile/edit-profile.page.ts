import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../providers/global/global';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { LoadingService } from '../providers/global/loading.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { Base64 } from '@ionic-native/base64';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  picToView: any;
  lastImage: string = null;
  signupForm: FormGroup;
  masks: any;
  userData = {
    email: "",
    mobile: "",
    bank: "",
    bank_account: "",
    paypal_account: "",
    lineid: "",
    fbprofile: "",
    id: '',
    imgprofile: ''
  };
  member_avatar: any;
  responseData: any;
  correctPath = '';
  currentName = '';
  result: any;
  change_picture = false;
  constructor(
    private camera: Camera,
    private network: Network,
    private webService: WebapiServiceProvider,
    private storage: Storage,
    private global: GlobalProvider,
    private transfer: FileTransfer,
    private loading: LoadingService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController,
    private translate: TranslateService,
    public alertController: AlertController
  ) {

    this.signupForm = new FormGroup({
      Infoemail: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'), Validators.minLength(10)]),
      Infomobile: new FormControl('', [Validators.required, Validators.minLength(12)]),
      Infobank: new FormControl('', []),
      Infoaccnumber: new FormControl('', [Validators.minLength(10)]),
      Infopaypal: new FormControl('', [Validators.minLength(5)]),
      Infolindid: new FormControl('', []),
      Infofacebook: new FormControl('', [])
    });
  }

  ngOnInit() {
  }
  ionViewWillEnter() {

    this.storage.get('loginStorage').then((result) => {
      // ถ้ามีการล็อกอินเข้ามาแล้ว
      if (result) {
        this.getUserData();
      }
    });
  }
  ionViewDidLoad() {

    this.getUserData();
  }
  presentActionSheet() {
    this.translate.get("select_picture").subscribe(select_picture => {
      this.translate.get("select_gallery").subscribe(select_gallery => {
        this.translate.get("camara").subscribe(camara => {
          this.translate.get("close").subscribe(close => {
            this.presentActionSheet2(select_picture, select_gallery, camara, close);
          });
        });
      });
    });
  }
  async presentActionSheet2(select_picture, select_gallery, camara, close) {

    const actionSheet = await this.actionSheetController.create({
      header: select_picture,
      buttons: [{
        text: select_gallery,
        role: 'destructive',
        icon: 'images',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: camara,
        icon: 'camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: close,
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true,
      allowEdit: true
    }
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      this.picToView = 'data:image/jpeg;base64,' + imagePath;
      this.change_picture = true;
    }, (err) => {
      this.translate.get("select_error").subscribe(select_error => {
        this.presentToast(select_error);
      });

    });
  }



  private presentToast(text) {
    this.webService.Toast(text);
  }
  // Always get the accurate path to your apps folder



  getUserData() {
    // ดึงข้อมูลผู้ใช้
    if (this.network.type !== "none") {
      // อ่านข้อมูล uuid จาก localstorage
      this.storage.get('localID').then((result) => {
        // Connect Web API
        this.webService.getData("users/editprofile", result).then((result) => {
          this.responseData = result;
          if (this.responseData.imgprofile != null && this.responseData.imgprofile != "") {
            this.picToView = this.responseData.imgprofile;
          } else {
            this.picToView = "assets/imgs/noimg.png";
          }
          this.userData.email = this.responseData.email;
          this.userData.mobile = this.responseData.mobile;
          this.userData.bank = this.responseData.bank;
          this.userData.bank_account = this.responseData.bank_account;
          this.userData.paypal_account = this.responseData.paypal_account;
          this.userData.lineid = this.responseData.lineid;
          this.userData.fbprofile = this.responseData.fbprofile;
        }, (error) => {
          console.log(error);
          if (error.status == 0) {
            this.webService.Toast("Error status Code:0 Web API Offline");
          }
        });
      });

    } else if (this.network.type === 'none') {
      this.translate.get("not_internet").subscribe(not_internet => {
        this.webService.Toast(not_internet);
      });

    }
  }
  updateProfile() {
    this.translate.get('push_pass').subscribe((val) => {
      this.translate.get("confirm").subscribe((confirm) => {
        this.translate.get('close').subscribe((close) => {
          this.updateProfile2(val, confirm, close);
        });

      });

    });
  }
  async pass_not_mash(text, close) {
    const alert = await this.alertController.create({
      header: text,
      buttons: [close]
    });

    await alert.present();
  }


  async updateProfile2(text, confirm, close) {
    const alert = await this.alertController.create({
      header: text,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: text
        }
      ],
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: confirm,
          handler: (val) => {
            console.log(val);
            this.storage.get('localID').then((result) => {
              this.webService.postData({ password: val.password, user_id: result }, 'users/check_password').then((result: any) => {
                if (result == '1') {
                  this.up_profile();
                } else {
                  this.translate.get("pass_not_mash").subscribe((pass_not_mash) => {
                    this.pass_not_mash(pass_not_mash, close);
                  });

                }
              });
            });

          }
        }
      ]
    });

    await alert.present();


  }
  // Update Profile
  up_profile() {
    this.loading.present();
    //alert(this.picToView);
    // Destination URL
    // var url = this.global.baseUrlApi + 'users/updateprofile';
    if (this.change_picture) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        fileKey: "photo",
        fileName: "image.jpg",
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }
      fileTransfer.upload(this.picToView, this.global.baseUrlApi + "users/upload_file", options).then((data: any) => {
        // this.result = JSON.stringify(data);
        this.result = JSON.parse(data.response);
        if (this.result.flag) {
          this.storage.get('localID').then((result) => {
            this.userData.id = result;
            this.userData.imgprofile = this.result.url;
            this.webService.postData(this.userData, 'users/update_profile').then((result: any) => {
              console.log(result);

              if (result - 0 === 1) {
                this.webService.load_data();
                this.translate.get("edit_success").subscribe(edit_success => {
                  this.webService.Toast(edit_success);
                  this.loading.dismiss();
                  this.router.navigate(['/']);
                });
              } else if (result - 0 === 2) {
                this.translate.get('have_email').subscribe((have_email) => {
                  this.translate.get("close").subscribe((close) => {
                    this.pass_not_mash(have_email, close);
                  });
                })
              } else if (result - 0 === 3) {
                this.webService.load_data();
                this.translate.get("edit_success").subscribe(edit_success => {
                  this.webService.Toast(edit_success);
                  this.loading.dismiss();
                  this.translate.get('p_email_code').subscribe((p_email_code) => {
                    this.translate.get("close").subscribe((close) => {
                      this.pass_not_mash(p_email_code, close);
                      setTimeout(() => {
                        this.router.navigate(['/']);
                      }, 2000);
                    });
                  });
                });
              }
            });
          });
        } else {
          this.webService.Toast("Upload Error ");
        }
        // loader.dismiss();
      }, error => {
        this.webService.Toast("Upload Error " + error);

      });
    } else {
      this.storage.get('localID').then((result) => {
        this.userData.id = result;
        this.userData.imgprofile = '';
        this.webService.postData(this.userData, 'users/update_profile').then((result: any) => {
          console.log(result);
          this.loading.dismiss();
          if (result - 0 === 1) {
            this.webService.load_data();
            this.translate.get("edit_success").subscribe(edit_success => {
              this.webService.Toast(edit_success);
              this.router.navigate(['/']);
            });
          } else if (result - 0 === 2) {
            this.translate.get('have_email').subscribe((have_email) => {
              this.translate.get("close").subscribe((close) => {
                this.pass_not_mash(have_email, close);
              });
            })
          } else if (result - 0 === 3) {
            this.webService.load_data();
            this.translate.get("edit_success").subscribe(edit_success => {
              this.webService.Toast(edit_success);
              this.translate.get('p_email_code').subscribe((p_email_code) => {
                this.translate.get("close").subscribe((close) => {
                  this.pass_not_mash(p_email_code, close);
                  setTimeout(() => {
                    this.router.navigate(['/']);
                  }, 2000);
                });
              });
            });
          }
        });
      });
    }
  }
}
