import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private webSrvice: WebapiServiceProvider,
    private storage: Storage,
    private rounter: Router,
    private translate: TranslateService
  ) {

  }
  ngOnInit() {

  }
  cancel() {
    this.translate.get('push_pass').subscribe(push_pass => {
      this.translate.get('close').subscribe(close => {
        this.translate.get('confirm_cancel').subscribe(confirm_cancel => {
          this.cancel2(push_pass, close, confirm_cancel);
        })
      })
    });

  }

  async cancel2(push_pass, close, confirm_cancel) {
    const alert = await this.alertController.create({
      header: push_pass,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: push_pass
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
          text: confirm_cancel,
          handler: (data) => {
            console.log(data);
            this.storage.get('userdata').then((result) => {
              data.user_id = result.id;
              this.webSrvice.postData(data, "users/cancel_busines").then(result => {
                if (result == "1") {
                  this.success();
                } else {
                  this.presentAlert();
                }
                console.log(result);
              })
            });

          }
        }
      ]
    });

    await alert.present();
  }
  success() {
    this.translate.get('cancel_business_success').subscribe(cancel_business_success => {
      this.translate.get('close').subscribe(close => {
        this.translate.get('cannot_login').subscribe(cannot_login => {
          this.success2(cancel_business_success, close, cannot_login);
        })
      });
    })
  }
  async success2(cancel_business_success, close, cannot_login) {


    const alert = await this.alertController.create({
      header: cancel_business_success,
      subHeader: cannot_login,
      buttons: [close]
    });
    setTimeout(() => {
      this.storage.set("login_temp", []);
      this.storage.remove('loginStorage');
      this.storage.remove('localID');
      // this.storage.remove("userdata");
      // this.app.getRootNav().setRoot(TabsPage);
      this.rounter.navigate(['/']);
    }, 5000);

    await alert.present();
  }
  presentAlert() {
    this.translate.get('pass_notmath').subscribe(pass_notmath => {
      this.translate.get('p_pass').subscribe(p_pass => {
        this.translate.get('close').subscribe(close => {
          this.presentAlert2(pass_notmath, p_pass, close);
        });
      });
    });
  }
  async presentAlert2(pass_notmath, p_pass, close) {
    const alert = await this.alertController.create({
      header: pass_notmath,
      subHeader: p_pass,
      buttons: [close]
    });

    await alert.present();
  }
}
