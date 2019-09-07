import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { GlobalProvider } from '../providers/global/global';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { ContactPage } from '../contact/contact.page';
import { VerifyemailPage } from '../verifyemail/verifyemail.page';
@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page {
  lang: any;
  login_status: any;

  responseData = { is_admin: 0, imgprofile: '', username: '', fullname: '', member_level: '', member_status: 0 };
  login_status_persistant: any;
  fullname_welcome: any;
  avatar_welcome: any;
  member_username: any;
  member_level: any;
  member_status: any;
  verify_email: any;
  status_color: any;
  constructor(
    private storage: Storage,
    private translate: TranslateService,
    private network: Network,
    private webService: WebapiServiceProvider,
    private global: GlobalProvider,
    private rounter: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {

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

  async contact() {
    const modal = await this.modalController.create({
      component: ContactPage
    });
    return await modal.present();
  }
  setting() {
    this.rounter.navigate(['settings']);
  }
  member_addday() {
    this.rounter.navigate(['confirm-addday']);
  }
  ionViewWillEnter() {
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.login_status = result;
        this.storage.get('localID').then((result) => {
          if (result) {
            if (this.network.type !== "none") {
              // Connect Web API
              this.webService.getData("users/index", result).then((result: any) => {
                this.responseData = result;
                if (this.responseData.imgprofile != null && this.responseData.imgprofile != "") {
                  this.avatar_welcome = this.responseData.imgprofile;
                } else {
                  this.avatar_welcome = "assets/imgs/noimg.png";
                }
                this.member_username = this.responseData.username;
                this.fullname_welcome = this.responseData.fullname;
                this.member_level = this.responseData.member_level;
                if (this.responseData.member_status == 1) {
                  this.member_status = 'Active';
                  this.status_color = 'secondary';
                } else if (this.responseData.member_status == 0) {
                  this.member_status = 'Inactive';
                  this.status_color = 'danger';
                }
              }, (error) => {
                console.log(error);
                if (error.status == 0) {
                  this.translate.get('not_internet').subscribe(not_internet => {
                    this.webService.Toast(not_internet);
                  });
                }
              });
            } else if (this.network.type === 'none') {
              this.translate.get('not_internet').subscribe(not_internet => {
                this.webService.Toast(not_internet);
              });
            }
          }
        });
        // do something
      } else {
        this.login_status = false;
      }
    });

    this.storage.get('loginPersistant').then((result) => {
      if (result) {
        this.login_status_persistant = result;
      }
    });
  }
  confirm_email() {
    this.translate.get('confirm_email_b').subscribe(confirm_email_b => {
      this.translate.get('close').subscribe(close => {
        this.translate.get('confirm_email').subscribe(confirm_email => {
          this.confirm_email2(confirm_email_b, close, confirm_email);
        });
      });
    });
  }
  async confirm_email2(confirm_email_b, close, confirm_email) {
    const alert = await this.alertController.create({
      header: confirm_email_b,
      // subHeader: 'Subtitle',
      // message: 'This is an alert message.',
      buttons: [
        {
          text: close,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: confirm_email,
          handler: () => {
            this.verifyemail();
          }
        }
      ]
    });

    await alert.present();
  }
  async verifyemail() {
    const modal = await this.modalController.create({
      component: VerifyemailPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
  add_day() {
    this.storage.get("userdata").then((result) => {
      this.responseData = result;
      if (result.verify_email == 0) {
        this.confirm_email();
      } else {
        this.rounter.navigate(['connect-system']);
      }

    });

  }
  level_click() {
    this.storage.get("userdata").then((result) => {
      this.responseData = result;
      if (result.verify_email == 0) {
        this.confirm_email();
      } else {
        this.rounter.navigate(['upgrade']);
      }
    });



  }
  switchLanguage() {
    this.translate.use(this.lang);
    // ต้องเก็บภาษาที่ผู้ใช้เปลี่ยนลง Local Storage เพื่อไว้กำหนดภาษาเริ่มต้น
    this.storage.set('setLanguage', this.lang);
  }

  ionViewDidLoad() {
    // code here

  }

  logout() {
    this.storage.get("userdata").then((data) => {
      this.storage.get("login_temp").then((temp) => {
        if (temp) {
          let flag = true;
          temp.forEach(element => {
            if (element.id == data.id) {
              flag = false;
            }
          });
          if (flag) {
            temp.push({ id: data.id, imgprofile: data.imgprofile, username: data.username, fullname: data.fullname })
          }
          this.storage.set("login_temp", temp);
        } else {
          this.storage.set("login_temp", [{ id: data.id, imgprofile: data.imgprofile, username: data.username, fullname: data.fullname }]);
        }
      })
    });
    this.storage.remove('loginStorage');
    this.storage.remove('localID');
    // this.storage.remove("userdata");
    // this.app.getRootNav().setRoot(TabsPage);
    this.rounter.navigate(['/']);
    // this.app.getActiveNavs()[0].parent.select(0);
    // location.reload();
  }

  doSomething() {
    alert("Show some thing...");
  }

  login() {
    // this.app.getRootNav().push(LoginPage);
    this.rounter.navigate(['login']);
  }

  showMyQRCode(userid) {
    this.rounter.navigate(['showmyqrcode', { userid: userid }]);
  }

  editProfile() {
    this.rounter.navigate(['edit-profile']);
  }

}
