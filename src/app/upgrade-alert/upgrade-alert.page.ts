import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../providers/global/loading.service';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { GlobalProvider } from '../providers/global/global';
import { NavParams, ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upgrade-alert',
  templateUrl: './upgrade-alert.page.html',
  styleUrls: ['./upgrade-alert.page.scss'],
})
export class UpgradeAlertPage implements OnInit {

  payment = {
    date: '',
    time: '',
    amount: 0,
    description: '',
    by_id: 0,
    to_id: 0,
    to_level: 0,
    bank: '',
    slip: '',
    channel: 'bank'
  };
  lastImage = '';
  picToView = "";
  constructor(
    private loading: LoadingService,
    private network: Network,
    private storage: Storage,
    private webService: WebapiServiceProvider,
    private global: GlobalProvider,
    private navParams: NavParams,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer,
    private translate: TranslateService


  ) {
    console.log(this.payment);
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
    this.payment.amount = this.navParams.get('amount');
    console.log(this.payment);
  }

  ngOnInit() {
  }
  logForm() {
    this.translate.get("confirm_payment").subscribe(confirm_payment => {
      this.translate.get('close').subscribe(close => {
        this.translate.get('confirm').subscribe(confirm => {
          this.logForm2(confirm_payment, confirm, close);
        });
      });
    });
  }

  async logForm2(confirm_payment, confirm, close) {
    const alert = await this.alertController.create({
      header: confirm_payment,
      // message: 'Message <strong>text</strong>!!!',
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
            if (this.network.type !== "none") {
              this.storage.get('localID').then((user_id) => {
                this.payment.by_id = user_id;
                this.payment.to_level = this.navParams.get('level');
                this.payment.to_id = this.navParams.get('userId');
                this.payment.bank = this.navParams.get('bank');
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
                    this.webService.postData(this.payment, 'payments/upgrade').then((result: any) => {
                      if (result - 0 == 1) {
                        this.translate.get('noti_payment_success').subscribe(noti_payment_success => {
                          this.webService.Toast(noti_payment_success);
                          this.loading.dismiss()
                          this.modalCtrl.dismiss();
                        });
                      } else {
                        this.loading.dismiss()
                        this.translate.get('not_internet').subscribe(not_internet => {
                          this.webService.Toast(not_internet);
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
  async add_slip() {
    const actionSheet = await this.actionSheetController.create({
      header: 'เลือกแหล่งของรูปภาพ',
      buttons: [{
        text: 'เลือกภาพจาก Gallery',
        role: 'destructive',
        icon: 'images',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'กล้องถ่ายรูป',
        icon: 'camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'ยกเลิก',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  private presentToast(text) {
    this.webService.Toast(text);
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    const options: CameraOptions = {
      quality: 50,
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
      this.presentToast('ผิดพลาด. ไม่ได้เลือกรูปภาพใด ๆ เข้ามา');
    });
  }
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  close() {
    this.modalCtrl.dismiss();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpgradeAlertPage');
  }

}
