import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Network } from '@ionic-native/network/ngx';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  lang: any;
  show_upgrade = false;
  login_status: any;
  tsincome: string = "income";
  isAndroid: boolean = false;
  income = { resive: { data: [], count: 0, sum: 0 }, upgrade: { data: [], count: 0, sum: 0 }, };
  page_number = { receive: 1, upgrade: 1 };
  responseNotfound = "";
  constructor(private platform: Platform,
    private storage: Storage,
    private translate: TranslateService,
    private webService: WebapiServiceProvider,
    private rounter: Router,
    private network: Network,
    public alertController: AlertController
  ) {
    this.isAndroid = platform.is('android');
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.login_status = result;
        this.load_pyament();
      }
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.login_status = result;
        this.load_pyament();
        // do something
      } else {
        this.login_status = false;
      }
    });

  }
  confirm(tp_id) {
    this.translate.get('confirm_level').subscribe(confirm_level => {
      this.translate.get('not_edit').subscribe(not_edit => {
        this.translate.get('close').subscribe(close => {
          this.translate.get('confirm').subscribe(confirm => {
            this.confirm2(tp_id, confirm_level, not_edit, close, confirm);
          });
        });
      });
    });

  }
  async confirm2(tp_id, confirm_level, not_edit, close, confirm) {
    const alert = await this.alertController.create({
      header: confirm_level,
      message: not_edit,
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
            this.webService.postData({ tp_id: tp_id }, 'payments/confirm_level').then((result: any) => {
              console.log(result);
              if (result - 0 == 1) {
                this.load_pyament();
                this.translate.get('confirm_success').subscribe(confirm_success => {
                  this.webService.Toast(confirm_success);
                })

              } else {
                this.translate.get('not_internet').subscribe(not_internet => {
                  this.webService.Toast(not_internet);
                });

              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
  cancel(tp_id) {
    this.translate.get('cancel_level').subscribe(cancel_level => {
      this.translate.get('not_edit_cancel').subscribe(not_edit_cancel => {
        this.translate.get('close').subscribe(close => {
          this.translate.get('cancel').subscribe(cancel => {
            this.cancel2(tp_id, cancel_level, not_edit_cancel, close, cancel);
          });
        });
      });
    });
  }
  async cancel2(tp_id, cancel_level, not_edit_cancel, close, cancel) {
    const alert = await this.alertController.create({
      header: cancel_level,
      message: not_edit_cancel,
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: cancel,
          handler: () => {
            this.webService.postData({ tp_id: tp_id }, 'payments/cancel_level').then((result: any) => {
              if (result - 0 == 1) {
                this.load_pyament();
                this.translate.get('cancel_success').subscribe(cancel_success => {
                  this.webService.Toast(cancel_success);
                });

              } else {
                this.translate.get('send_error').subscribe(send_error => {
                  this.webService.Toast(send_error);
                });

              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
  upgrade_click() {
    console.log('upgrade_click');
    // this.navCtrl.push(UpgradePage);
    this.rounter.navigate(['upgrade']);
  }
  system_click() {
    console.log('system_click');
    // this.navCtrl.push(ConnectSystemPage);
    this.rounter.navigate(['connect-system']);
  }
  load_receive() {
    this.storage.get('localID').then((user_id) => {
      // do something
      this.page_number.receive++;
      this.webService.getData("payments/load_receive", user_id + "/" + this.page_number.receive).then((result: any) => {
        console.log(result);
        result.forEach(element => {
          this.income.resive.data.push(element);
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
  load_upgrade() {
    this.storage.get('localID').then((user_id) => {
      // do something
      this.page_number.upgrade++;
      this.webService.getData("payments/load_upgrade", user_id + "/" + this.page_number.upgrade).then((result: any) => {
        result.forEach(element => {
          this.income.upgrade.data.push(element);
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
  load_pyament() {
    if (this.network.type !== "none") {
      // Connect Web API
      this.storage.get('localID').then((user_id) => {

        // do something
        this.webService.getData("payments/load_payments", user_id).then((result: any) => {
          console.log(result);
          this.income = result;
          this.page_number.receive = 1;
          this.page_number.upgrade = 1;
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
  ionViewDidLoad() {
    // code here
    // ถ้าเข้าระบบแล้วเท่านั้น

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.load_pyament();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.target.complete();
    }, 2000);
  }

  login() {
    this.rounter.navigate(['login']);
  }

}
