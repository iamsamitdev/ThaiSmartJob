import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-showpayment',
  templateUrl: './showpayment.page.html',
  styleUrls: ['./showpayment.page.scss'],
})
export class ShowpaymentPage implements OnInit {
  data = {
    fullname: '',
    tp_id: ''
  };
  constructor(
    private modalCtrl: ModalController,
    private navParam: NavParams,
    private photoViewer: PhotoViewer,
    private callNumber: CallNumber,
    private webService: WebapiServiceProvider,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.data = navParam.get('value');
  }

  ngOnInit() {

  }
  view(img) {
    this.photoViewer.show(img);
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  tel(tel) {
    this.callNumber.callNumber(tel, true)
  }
  confirm() {
    this.translate.get('check_true').subscribe(check_true => {
      this.translate.get('not_edit').subscribe(not_edit => {
        this.translate.get('close').subscribe(close => {
          this.translate.get('confirm').subscribe(confirm => {
            this.confirm2(check_true, not_edit, close, confirm);
          });
        });
      })
    });
  }
  async confirm2(check_true, not_edit, close, confirm) {
    const alert = await this.alertController.create({
      header: check_true,
      message: not_edit,
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: confirm,
          handler: () => {
            this.webService.postData({ tp_id: this.data.tp_id, status: 1 }, 'payments/change_payment').then((result: any) => {
              if (result - 0 == 1) {
                this.translate.get('confirm_success').subscribe(confirm_success => {
                  this.webService.Toast(confirm_success);
                  this.webService.load_data();
                  this.closeModal();
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
  cancel() {
    this.translate.get('check_true').subscribe(check_true => {
      this.translate.get('not_edit_cancel').subscribe(not_edit_cancel => {
        this.translate.get('close').subscribe(close => {
          this.translate.get('cancel').subscribe(cancel => {
            this.cancel2(check_true, not_edit_cancel, close, cancel);
          });
        });
      });
    });
  }
  async cancel2(check_true, not_edit_cancel, close, cancel) {
    const alert = await this.alertController.create({
      header: check_true,
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
            this.webService.postData({ tp_id: this.data.tp_id, status: 2 }, 'payments/change_payment').then((result: any) => {
              if (result - 0 == 1) {
                this.translate.get('cancel_success').subscribe(cancel_success => {
                  this.webService.Toast(cancel_success);
                  this.webService.load_data();
                  this.closeModal();
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
}
