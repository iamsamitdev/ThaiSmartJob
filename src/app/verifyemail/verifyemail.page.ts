import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { AlertController, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalProvider } from '../providers/global/global';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.page.html',
  styleUrls: ['./verifyemail.page.scss'],
})
export class VerifyemailPage implements OnInit {
  verifyForm: FormGroup;
  masks: any;
  userData = {
    "verifycode": "",
    member_id: ''
  }
  responseData: any;
  constructor(
    private storage: Storage,
    private network: Network,
    private webService: WebapiServiceProvider,
    private alertController: AlertController,
    private global: GlobalProvider,
    private translate: TranslateService,
    private modalCtrl: ModalController
  ) {
    this.verifyForm = new FormGroup({
      Infoverifycode: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(4), Validators.maxLength(4)])
    });
  }
  ngOnInit() {
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  error() {
    this.translate.get('error').subscribe(error => {
      this.translate.get('code_not_valid').subscribe(code_not_valid => {
        this.translate.get("close").subscribe(close => {
          this.error2(error, code_not_valid, close);
        });
      });
    });
  }
  async error2(error, code_not_valid, close) {
    const alert = await this.alertController.create({
      header: error,
      message: code_not_valid,
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }
  success() {
    this.translate.get('close').subscribe(close => {
      this.translate.get('confirm_email_success').subscribe(confirm_email_success => {
        this.success2(close, confirm_email_success);
      });

    });
  }
  async success2(close, confirm_email_success) {
    this.webService.load_data();
    const alert = await this.alertController.create({
      message: "<center><img src='assets/imgs/check_mark_true.jpg' width='100'><h2 style='margin-top:0px'>" + confirm_email_success + "</h2></center>",
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.closeModal();
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }
  verify() {
    this.storage.get('localID').then((result) => {
      if (result) {
        // เช็คว่ามีการเชื่อมต่อ network หรือยัง
        if (this.network.type !== "none") {
          this.userData.member_id = result;
          this.webService.postData(this.userData, 'users/verify_email_account').then((result) => {
            this.responseData = result;
            if (this.responseData.Sucess) {

              this.success();
            } else {
              this.error();
            }

          }, (err) => {
            console.log(err);
          });
        } else if (this.network.type === 'none') {
          this.global.noNetworkConnection();
        } else {
          this.global.noNetworkConnection();
        }
      }
    });
  }
}
