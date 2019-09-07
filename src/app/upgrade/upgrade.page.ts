import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { UpgradeAlertPage } from '../upgrade-alert/upgrade-alert.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.page.html',
  styleUrls: ['./upgrade.page.scss'],
})
export class UpgradePage implements OnInit {
  lang: any;
  responseNotfound = "";
  isAndroid: boolean = false;
  avatar_welcome = "assets/imgs/noimg.png";
  member_status: any;
  status_color: any;
  responseData: any = {
    fullname: '',
    member_level: 0,
    id: 0,
    to_level: 0,
    amount: 0
  };
  constructor(
    private network: Network,
    private translate: TranslateService,
    private router: Router,
    public modalController: ModalController,
    private callNumber: CallNumber,
    private storage: Storage,
    private device: Device,
    private webService: WebapiServiceProvider,
    private iab: InAppBrowser,
    private appAvailability: AppAvailability,
    private clipboard: Clipboard,
    private alertController: AlertController
  ) {
    storage.get('setLanguage').then((result) => {
      if (result) {
        this.lang = result;
        this.translate.setDefaultLang(result);
        this.translate.use(result);
        // ถ้ายังไม่เคยเปลี่ยนภาษาให้ใช้ ภาษาไทยเริ่มต้น
      } else {
        this.lang = 'th';
        this.translate.setDefaultLang('th');
        this.translate.use('th');
      }
    });
  }

  ngOnInit() {
  }
  copy(text) {
    this.clipboard.copy(text);
    this.translate.get('copy').subscribe(copy => {
      this.webService.Toast(copy);
    });

  }

  call_number(number) {
    console.log('call');
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }
  facebook(url: any) {
    // window.open(url);
    this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', url);

    // const browser = this.iab.create("http://'fb-messenger://"+url);
    // browser.show();
  }
  upgrade_alert(user_id, level, amount, bank) {
    this.translate.get('add_day_b').subscribe(add_day_b => {
      this.translate.get('add_day').subscribe(add_day => {
        this.translate.get('close').subscribe(close => {
          this.upgrade_alert2(user_id, level, amount, bank, add_day_b, add_day, close)
        });
      });
    });
  }
  async upgrade_alert2(user_id, level, amount, bank, add_day_b, add_day, close) {
    console.log(this.responseData);
    if (this.responseData.upgrade_date - 0 < 2) {
      const alert = await this.alertController.create({
        header: add_day_b,
        buttons: [
          {
            text: close,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: add_day,
            handler: () => {
              this.router.navigate(['connect-system']);
              console.log('Confirm Okay');
            }
          }
        ]
      });

      await alert.present();
    } else {
      const modal = await this.modalController.create({
        component: UpgradeAlertPage,
        componentProps: { userId: user_id, level: level, amount: amount, bank: bank }
      });
      modal.dismiss(() => {
        this.load_upgrade();
      });
      modal.onDidDismiss().then(() => {
        this.load_upgrade();
      })
      return await modal.present();
    }


  }
  close() {
    this.router.navigate(['tabs/tab1']);
  }

  launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string, username: string) {
    let app: string;
    if (this.device.platform === 'iOS') {
      app = iosSchemaName;
    } else if (this.device.platform === 'Android') {
      // app = androidPackageName;

      this.iab.create(httpUrl + username).show();
      return;
    } else {
      this.iab.create(httpUrl + username).show();
      return;
    }

    this.appAvailability.check(app).then(
      () => { // success callback
        this.iab.create(appUrl + username).show();
        // let browser = new InAppBrowser(appUrl + username, '_system');
      },
      () => { // error callback
        this.iab.create(httpUrl + username).show();
        // let browser = new InAppBrowser(httpUrl + username, '_system');
      }
    );
  }
  ionViewWillEnter() {
    console.log('upgrade ionViewWillEnter');
    this.load_upgrade();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UpgradePage');
  }
  load_upgrade() {
    if (this.network.type !== "none") {
      // Connect Web API
      this.storage.get('localID').then((user_id) => {
        this.webService.getData("users/upgrade_to_user", user_id).then((result: any) => {
          console.log(result);
          this.responseData = result;
          this.avatar_welcome = result.imgprofile;
          if (this.responseData.member_status == 1) {
            this.member_status = 'Active';
            this.status_color = 'secondary';
          } else if (this.responseData.member_status == 0) {
            this.member_status = 'Inactive';
            this.status_color = 'danger';
          }
        }, (error) => {
          this.translate.get('send_error').subscribe(send_error => {
            this.responseNotfound = send_error;
            if (error.status == 0) {
              this.translate.get('not_internet').subscribe(not_internet => {
                this.webService.Toast(not_internet);
              });

            }
          });
        });
      });
    } else if (this.network.type === 'none') {
      this.translate.get('not_internet').subscribe(not_internet => {
        this.webService.Toast(not_internet);
      });
    }
  }
  paypal(paypal) {
    const browser = this.iab.create('https://www.paypal.me/' + paypal);
    // browser.close();
  }

}
