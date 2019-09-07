import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { AlertController, ModalController } from '@ionic/angular';
import { ShowpaymentPage } from '../showpayment/showpayment.page';
import { OverlayEventDetail } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-noti-upgrade',
  templateUrl: './noti-upgrade.page.html',
  styleUrls: ['./noti-upgrade.page.scss'],
})
export class NotiUpgradePage implements OnInit {
  responseNotfound = '';
  noti: any;
  constructor(
    private network: Network,
    private storage: Storage,
    private webService: WebapiServiceProvider,
    private alertController: AlertController,
    private modalController: ModalController,
    private translate: TranslateService

  ) {
    this.load_noti();
  }

  ngOnInit() {
  }
  load_noti() {
    if (this.network.type !== "none") {
      // Connect Web API
      this.storage.get('localID').then((user_id) => {
        this.webService.getData("notification/get_noti", user_id).then((result) => {
          console.log(result);
          this.noti = result;

        }, (error) => {
          this.translate.get('send_error').subscribe(send_error => {
            this.responseNotfound = send_error;
          });

          if (error.status == 0) {
            this.translate.get('not_internet').subscribe(not_internet => {
              this.webService.Toast(not_internet);
            });

          }
        });
      });
      this.webService.load_data();
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
  team_change(team) {
    this.translate.get("confirm_payment").subscribe(confirm_payment => {
      this.translate.get('not_edit').subscribe(not_edit => {
        this.translate.get('cancel').subscribe(cancel => {
          this.translate.get('confirm').subscribe(confirm => {
            this.translate.get('close').subscribe(close => {
              this.team_change2(team, confirm_payment, not_edit, cancel, confirm, close);
            });
          })
        });
      });
    });
  }
  async team_change2(team, confirm_payment, not_edit, cancel, confirm, close) {
    const alert = await this.alertController.create({
      header: confirm_payment,
      message: not_edit,
      buttons: [
        {
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
                this.translate.get('send_error').subscribe(send_error => {
                  this.responseNotfound = send_error;
                });
              }
            });
          }
        }, {
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
                this.translate.get('send_error').subscribe(send_error => {
                  this.responseNotfound = send_error;
                });
              }
            });
          }
        }
        // , {
        //   text: close,
        //   role: 'cancel',
        //   cssClass: 'secondary',
        //   handler: (blah) => {
        //     console.log('Confirm Cancel: blah');
        //   }
        // }
      ]
    });

    await alert.present();
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
