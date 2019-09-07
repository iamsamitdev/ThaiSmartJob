import { Component } from '@angular/core';
import { Platform, AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Router } from '@angular/router';
import { ReadNotiPage } from '../read-noti/read-noti.page';
import { OverlayEventDetail } from '@ionic/core';
import { ShowpaymentPage } from '../showpayment/showpayment.page';
@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  lang: any;
  login_status: any;
  tsjnotify: string = "teams";
  isAndroid: boolean = false;
  responseNotfound = '';
  noti = {
    team: [], system: {
      data: [],
      count: 0
    }
  };
  system_pagenumber = 1;
  constructor(
    private platform: Platform,
    private storage: Storage,
    private translate: TranslateService,
    private network: Network,
    private webService: WebapiServiceProvider,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {

    this.isAndroid = platform.is('android');
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.login_status = result;
        // do something
      }
    });
    // ถ้าเคยเปลี่ยนภาษาให้ดึงจาก local storage
    this.storage.get('setLanguage').then((result) => {
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
  removeHTMLInfo(value: string) {
    if (value)

      return value.replace(/<\/?[^>]+>/gi, "");
  }
  load_system() {
    this.storage.get('localID').then((user_id) => {
      this.system_pagenumber++;
      this.webService.getData("notification/load_system", user_id + "/" + this.system_pagenumber).then((result: any) => {
        result.forEach(element => {
          this.noti.system.data.push(element);
        });

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
  }
  team_change(team) {
    this.translate.get('confirm_payment').subscribe(confirm_payment => {
      this.translate.get('not_edit').subscribe(not_edit => {
        this.translate.get('cancel').subscribe(cancel => {
          this.translate.get('confirm').subscribe(confirm => {
            this.translate.get('close').subscribe(close => {
              this.team_change2(team, confirm_payment, not_edit, cancel, confirm, close);
            });

          });
        });

      });
    })

  }
  async team_change2(team, confirm_payment, not_edit, cancel, confirm, close) {
    const alert = await this.alertController.create({
      header: confirm_payment,
      message: not_edit,
      buttons: [
        {
          text: cancel,
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');//2
            this.webService.postData({ tp_id: team.tp_id, status: 2 }, 'payments/change_payment').then((result: any) => {
              if (result - 0 == 1) {
                this.translate.get('cancel_success').subscribe(cancel_success => {
                  this.webService.Toast(cancel_success);
                  this.load_noti();
                });


              } else {
                this.translate.get('not_internet').subscribe(not_internet => {
                  this.webService.Toast(not_internet);
                });
              }
            });
          }
        }, {
          text: confirm,
          handler: () => {
            console.log('Confirm Okay');//1
            this.webService.postData({ tp_id: team.tp_id, status: 1 }, 'payments/change_payment').then((result: any) => {
              if (result - 0 == 1) {
                this.translate.get('confirm_success').subscribe(confirm_success => {
                  this.webService.Toast(confirm_success);
                  this.load_noti();
                });
              } else {
                this.translate.get('not_internet').subscribe(not_internet => {
                  this.webService.Toast(not_internet);
                });
              }
            });
          }
        }, {
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
  async  read(s) {

    const modal = await this.modalController.create({
      component: ReadNotiPage,
      componentProps: { value: s }
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      this.load_noti();
    });

    return await modal.present();
  }
  ionViewWillEnter() {
    // code here
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.login_status = result;
        this.load_noti();
      } else {
        this.login_status = false;
      }
    });
  }

  load_noti() {
    if (this.network.type !== "none") {
      // Connect Web API
      this.storage.get('localID').then((user_id) => {
        this.webService.getData("notification/load_noti", user_id).then((result: any) => {
          this.system_pagenumber = 1;
          this.noti = result;
          this.webService.load_data();
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
  doRefresh(refresher) {
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.load_noti();
        refresher.target.complete();
      } else {
        refresher.target.complete();
      }
    });

  }

  login() {
    // this.app.getRootNav().push(LoginPage);
    this.router.navigate(['login']);
  }

  async show_detail(detail) {
    const modal = await this.modalController.create({
      component: ShowpaymentPage,
      componentProps: { value: detail }
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      this.load_noti();
    });
    return await modal.present();
  }
}
