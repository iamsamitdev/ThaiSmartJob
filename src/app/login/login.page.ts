import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Storage } from '@ionic/storage';
import { ModalController, Platform, Events, AlertController } from '@ionic/angular';
import { LoginReset1Page } from '../login-reset1/login-reset1.page';
import { Device } from '@ionic-native/device/ngx';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  userData = { "username": "", "password": "" };
  responseData: any;
  login_status_persistant: any;
  login_temp = [];
  login_show = true;
  constructor(
    private router: Router,
    public network: Network,
    public webService: WebapiServiceProvider,
    public storage: Storage,
    private modalController: ModalController,
    private device: Device,
    private platform: Platform,
    private event: Events,
    private alertController: AlertController,
    private translate: TranslateService
  ) {
    this.storage.get('login_temp').then((data) => {
      console.log(data);
      this.login_temp = data;
    })
  }
  not_me() {
    this.login_show = true;
  }
  select(member, i) {
    this.translate.get("push_pass").subscribe(push_pass => {
      this.translate.get("close").subscribe(close => {
        this.translate.get("remove").subscribe(remove => {
          this.translate.get("login").subscribe(login => {
            this.select2(member, i, push_pass, close, remove, login);
          });

        });
      });
    });
  }

  async select2(member, i, push_pass, close, remove, login) {
    const alert = await this.alertController.create({
      header: push_pass,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        }

      ],
      buttons: [
        // {
        //   text: close,
        //   role: 'cancel',
        //   cssClass: 'secondary',
        //   handler: () => {
        //     console.log('Confirm Cancel');
        //   }
        // },
         {
          text: remove,
          handler: () => {
            this.login_temp.splice(i, 1);
            this.storage.set("login_temp", this.login_temp);
          }
        },
        {
          text: login,
          handler: (data) => {
            let form = {
              value: {
                username: member.username,
                password: data.password
              }
            };
            this.login(form);
          }
        }
      ]
    });

    await alert.present();
  }
  ngOnInit() {
  }
  register() {
    this.router.navigate(['findsponsor']);
  }
  close() {

  }

  async reset_pass() {
    const modal = await this.modalController.create({
      component: LoginReset1Page,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
  ionViewWillEnter() {
    this.storage.get('loginStorage').then((result) => {
      // ถ้ามีการล็อกอินเข้ามาแล้ว
      if (result) {
        this.router.navigate(['/tabs']);
      } else {

      }
    });
  }
  login(form) {


    console.log(form.value);
    // เช็คว่ามีการเชื่อมต่อ network หรือยัง
    if (this.network.type !== "none") {
      let data = form.value;
      console.log(this.platform.is("desktop"));
      if (!this.platform.is('desktop')) {
        data.uuid = this.device.uuid;
      } else {
        data.uuid = 'browser';
      }
      console.log(data);
      this.webService.postData(data, 'users/login').then((result) => {
        this.responseData = result;

        if (this.responseData.id != "") {
          if (this.responseData.flag == '0') {
            // this.webService.Toast(this.responseData.flag);
            this.confirm_login(data);
          } else {
            // บันทึกชื่อ username ลงตัวแปร localStorage
            this.storage.set('localID', this.responseData.id);
            this.storage.set('loginStorage', true);
            this.storage.set('loginPersistant', this.responseData.username);
            setTimeout(() => {
              this.webService.load_data();
              this.event.publish("login", {});
              this.router.navigate(['/tabs']);
            }, 100);

          }

        } else {
          this.translate.get("error").subscribe(error => {
            this.translate.get("user_passs_notmach").subscribe(user_passs_notmach => {
              this.webService.presentAlert(error, user_passs_notmach);
            });

          });


        }
      });

    } else if (this.network.type === 'none') {
      this.translate.get('not_internet').subscribe(not_internet => {
        this.webService.Toast(not_internet);
      })


    } else {
      this.translate.get('not_internet').subscribe(not_internet => {
        this.webService.Toast(not_internet);
      });

    }
  }
  confirm_login(data) {
    this.translate.get("divice_use").subscribe(divice_use => {
      this.translate.get("logou_use").subscribe(logou_use => {
        this.translate.get('close').subscribe(close => {
          this.translate.get('confirm').subscribe(confirm => {
            this.confirm_login2(data, divice_use, logou_use, close, confirm);
          });

        });
      });
    });
  }
  async confirm_login2(data, divice_use, logou_use, close, confirm) {
    const alert = await this.alertController.create({
      header: divice_use,
      subHeader: logou_use,
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: confirm,
          handler: () => {
            this.webService.postData(data, 'users/confirm_login').then((result) => {
              this.responseData = result;
              if (this.responseData.id != "") {
                // บันทึกชื่อ username ลงตัวแปร localStorage
                this.storage.set('localID', this.responseData.id);
                this.storage.set('loginStorage', true);
                this.storage.set('loginPersistant', this.responseData.username);
                setTimeout(() => {
                  this.webService.load_data();
                  this.event.publish("login", {});
                }, 100);
                this.router.navigate(['/tabs']);
              } else {
                this.translate.get("error").subscribe(error => {
                  this.translate.get("user_passs_notmach").subscribe(user_passs_notmach => {
                    this.webService.presentAlert(error, user_passs_notmach);
                  });
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
