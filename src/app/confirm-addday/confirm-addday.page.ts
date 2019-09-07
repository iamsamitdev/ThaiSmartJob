import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ConfirmAdddayConfirmPage } from '../confirm-addday-confirm/confirm-addday-confirm.page';
import { OverlayEventDetail } from '@ionic/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-addday',
  templateUrl: './confirm-addday.page.html',
  styleUrls: ['./confirm-addday.page.scss'],
})
export class ConfirmAdddayPage implements OnInit {
  payments: any;
  constructor(
    private modalController: ModalController,
    private network: Network,
    private storage: Storage,
    private webService: WebapiServiceProvider,
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.load_payment();
  }
  load_payment() {
    if (this.network.type !== "none") {
      this.webService.getData("users/connect_payment", '').then((result: any) => {
        this.payments = result;
        this.webService.load_data();
      }, (error) => {
        if (error.status == 0) {
          this.translate.get('not_internet').subscribe(t => {
            this.webService.Toast(t);
          });
        }
      });

    } else if (this.network.type === 'none') {
      this.translate.get('not_internet').subscribe(t => {
        this.webService.Toast(t);
      });

    }
  }
  team_change(team) {
    this.translate.get("confirm_payment").subscribe(t1 => {
      this.translate.get("not_edit").subscribe(t2 => {
        this.translate.get("cancel").subscribe(t3 => {
          this.translate.get("confirm").subscribe(t4 => {
            this.translate.get("close").subscribe(t5 => {
              this.team_change2(team, t1, t2, t3, t4, t5);
            });
          });
        });
      });
    });
  }
  async team_change2(team, t1, t2, t3, t4, t5) {
    const alert = await this.alertController.create({
      header: t1,
      message: t2,
      buttons: [
        {
          text: t4,
          handler: () => {
            console.log('Confirm Okay');//1
            this.webService.postData({ cp_id: team.cp_id, status: 1 }, 'payments/change_payment_day').then((result: any) => {
              if (result - 0 == 1) {
                this.translate.get("confirm_success").subscribe(t => {
                  this.webService.Toast(t);
                  this.load_payment();
                });

              } else {
                this.translate.get("send_error").subscribe(t => {
                  this.webService.Toast(t);
                });
              }
            });
          }
        },  {
          text: t3,
          cssClass: 'secondary',
          handler: (blah) => {
            this.webService.postData({ cp_id: team.cp_id, status: 2 }, 'payments/change_payment_day').then((result: any) => {
              if (result - 0 == 1) {
                this.translate.get("cancel_success").subscribe(t => {
                  this.webService.Toast(t);
                  this.load_payment();
                });
              } else {
                this.translate.get("send_error").subscribe(t => {
                  this.webService.Toast(t);
                })

              }
            });
          }
        } 
        // ,{
        //   text: t5,
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
      component: ConfirmAdddayConfirmPage,
      componentProps: { value: detail }
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      this.load_payment();
    });
    return await modal.present();
  }
}
