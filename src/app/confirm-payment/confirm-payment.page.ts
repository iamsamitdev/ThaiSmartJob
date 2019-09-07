import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Network } from '@ionic-native/network/ngx';
import { LoadingService } from '../providers/global/loading.service';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { GlobalProvider } from '../providers/global/global';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-payment',
  templateUrl: './confirm-payment.page.html',
  styleUrls: ['./confirm-payment.page.scss'],
})
export class ConfirmPaymentPage implements OnInit {
  payment = {
    date: '',
    time: '',
    user_id: '',
    amount: 300,
    day: '30',
    description: '',
    slip: ''
  };
  lastImage = '';
  picToView = "";
  is_send = true;
  constructor(
    private router: Router,
    private location: Location,
    private alertController: AlertController,
    private storage: Storage,
    private network: Network,
    private loading: LoadingService,
    private webService: WebapiServiceProvider,
    private global: GlobalProvider,
    private route: ActivatedRoute,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private translate: TranslateService
  ) {
    this.payment.amount = +this.route.snapshot.params['payment'];//this.route.snapshot.paramMap.get('payment');
    this.payment.day = this.route.snapshot.params['day'];
    console.log(this.route.snapshot);

    let d = new Date();
    let m = '';
    let month = (d.getMonth() + 1);
    if (month < 10) {
      m = '0' + month;
    } else {
      m = month + "";
    }
    let date = d.getDate();
    let da = '';
    if (date < 10) {
      da = "0" + date;
    } else {
      da = date + '';
    }
    let mi = d.getMinutes();
    let mii = '';
    if (mi < 10) {
      mii = '0' + mi;
    } else {
      mii = '' + mi;
    }
    this.payment.date = d.getFullYear() + "-" + m + "-" + da;
    this.payment.time = d.getHours() + ":" + mii;
    console.log(this.payment);
    this.storage.get('localID').then((result) => {
      webService.getData("users/check_adddate", result).then((res: number) => {
        if (res - 0 == 1) {
          this.is_send = false;
        }
      });
    });
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
      allowEdit: false
    }
    this.camera.getPicture(options).then((imagePath) => {
      this.picToView = 'data:image/jpeg;base64,' + imagePath;

    }, (err) => {
      this.translate.get("select_error").subscribe(select_error => {
        this.presentToast(select_error);
      });

    });
  }

  private presentToast(text) {
    this.webService.Toast(text);
  }
  add_slip() {
    this.translate.get("select_picture").subscribe(select_picture => {
      this.translate.get('select_gallery').subscribe(select_gallery => {
        this.translate.get("camara").subscribe(camara => {
          this.translate.get("close").subscribe(close => {
            this.add_slip2(select_picture, select_gallery, camara, close);
          });
        })
      })
    });
  }
  async add_slip2(select_picture, select_gallery, camara, close) {
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
  ngOnInit() {
  }
  close() {
    this.location.back();
    // this.router.navigate(['/connect-system']);
  }
  logForm() {
    this.translate.get("confirm_payment").subscribe(confirm_payment => {
      this.translate.get("close").subscribe(close => {
        this.translate.get('confirm').subscribe(confirm => {
          this.logForm2(confirm_payment, close, confirm);
        });
      });
    });
  }
  async logForm2(confirm_payment, close, confirm) {
    const alert = await this.alertController.create({
      header: confirm_payment,
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: confirm,
          handler: () => {
            console.log('Confirm Okay');
            if (this.network.type !== "none") {
              this.storage.get('localID').then((user_id) => {
                this.payment.user_id = user_id;
                this.loading.present();
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
                  let result = JSON.parse(data.response);
                  if (result.flag) {
                    this.payment.slip = result.url;
                    this.webService.postData(this.payment, 'payments/system_pay').then((result2: any) => {
                      if (result2 - 0 == 1) {
                        this.loading.dismiss();
                        this.translate.get("noti_payment_success").subscribe(noti_payment_success => {
                          this.webService.Toast(noti_payment_success);
                          setTimeout(() => {
                            this.translate.get("check_in42hr").subscribe(check_in42hr => {
                              this.webService.Toast(check_in42hr);
                            });
                          }, 2000);
                        });

                        // this.modalCtrl.dismiss();
                        this.router.navigate(['/']);
                      } else {
                        this.loading.dismiss()
                        this.translate.get('send_error').subscribe(send_error => {
                          this.webService.Toast(send_error);
                        });
                      }
                      console.log(result);
                    });
                  } else {
                    this.webService.Toast("Upload Error ");
                  }
                  // loader.dismiss();
                }, error => {
                  this.webService.Toast("Upload Error " + error);

                });
              });

            } else {
              this.global.noNetworkConnection();
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
