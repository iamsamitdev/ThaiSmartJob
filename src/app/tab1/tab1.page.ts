import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalProvider } from '../providers/global/global';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Events, ModalController, AlertController } from '@ionic/angular';
import { VerifyemailPage } from '../verifyemail/verifyemail.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  responseData: any = {
    last_member: 0,
    last_team: 0,
    upgrade_date: 0,
    noti_upgrade: 0
  };
  login_status: any;
  login_status_persistant: any;
  fullname_welcome: any;
  avatar_welcome: any = 'assets/imgs/noimg.png';
  member_avatar = "";
  member_level: any;
  member_status: any;
  status_color: any;
  verify_email: any;

  // Hello in a day
  today: any;
  curHr: any;
  textSayTime: any;
  lang: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  slides = [];
  banners = [];
  test = { aaaa: {} };
  constructor(
    public storage: Storage,
    public translate: TranslateService,
    private router: Router,
    public network: Network,
    private event: Events,
    private webService: WebapiServiceProvider,
    public global: GlobalProvider,
    private rounter: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private iab: InAppBrowser
  ) {
    // this.webService.getData('users/get','').then(data => {
    //   console.log(data);
    //   this.test.aaaa = data;
    // });
    event.subscribe('login', data => {
      console.log('login success');
      this.getUserData();
    })

    this.today = new Date();
    this.curHr = this.today.getHours();
    if (this.curHr < 12) {
      this.storage.get('setLanguage').then((result) => {
        if (result == "en") {
          this.textSayTime = "Good Morining";
        } else {
          this.textSayTime = "สวัสดีตอนเช้า";
        }
      });
    } else if (this.curHr < 18) {
      this.storage.get('setLanguage').then((result) => {
        if (result == "en") {
          this.textSayTime = "Good Afternoon";
        } else {
          this.textSayTime = "สวัสดีตอนบ่าย";
        }
      });
    } else {
      this.storage.get('setLanguage').then((result) => {
        if (result == "en") {
          this.textSayTime = "Good Evening";
        } else {
          this.textSayTime = "สวัสดีตอนค่ำ";
        }
      });
    }

    setTimeout(() => {
      this.loop_check();
    }, 2000);
    webService.getData('users/load_slides', '').then((res: any) => {
      this.slides = res;
    });
    webService.getData('users/load_banners', '').then((res: any) => {
      this.banners = res;
      console.log(this.banners);
    })

  }
  setMyStyles(url, color) {
    let styles = {
      'background-image': 'url("' + url + '")',
      'color': color
    };
    return styles;
  }
  avatar_click() {
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.rounter.navigate(['edit-profile']);
      }

    });
  }
  status_click() {
    if (this.responseData.connect_date < 2) {
      this.connect_system();
    } else {
      this.upgrade();
    }
    console.log('status click');
  }
  ionViewWillUnload() {
    this.event.unsubscribe('login');
  }
  // ionViewDidEnter(): void {
  //   this.getUserData();
  // }
  banner_click(url) {
    if (!(url == '#' || url == '')) {
      this.iab.create(url);
    }

  }
  upgrade() {
    if (this.verify_email == 0) {
      this.confirm_email();
    } else {
      this.router.navigate(['upgrade']);
    }
  }
  showMyQRCode() {
    this.storage.get('loginPersistant').then((result) => {
      this.router.navigate(['showmyqrcode', { userid: result }]);
      // this.app.getRootNav().push(ShowmyqrcodePage, { userid: result });
    });
  }
  connect_system() {
    console.log(this.verify_email);
    if (this.verify_email == 0) {
      this.confirm_email();
    } else {
      if (this.member_level != 0) {
        this.router.navigate(['connect-system']);
      } else {
        this.upgrade();
      }

    }
    // this.navCtrl.push(ConnectSystemPage);
  }
  recent_register() {
    this.router.navigate(['last-register']);
    // this.navCtrl.push(LastRegisterPage);

  }
  upgrade_notify() {

    this.router.navigate(['noti-upgrade']);


    // this.navCtrl.push(NotiUpgradePage);
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
  recent_team() {
    this.router.navigate(['team-last']);
  }
  ionViewDidLoad() {
    // this.getUserData();
    console.log('ionViewDidLoad');
  }

  login() {
    this.router.navigate(['login']);


  }
  ionViewWillEnter() {

    this.storage.get('loginStorage').then((result) => {
      // ถ้ามีการล็อกอินเข้ามาแล้ว
      if (result) {
        this.login_status = result;
        this.getUserData();
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
  register() {
    this.router.navigate(['findsponsor']);
  }
  doRefresh(refresher) {
    // begin

    // end
    // ถ้าเข้าระบบแล้วเท่านั้น
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.getUserData();
        // refresher.complete();
        setTimeout(() => {
          refresher.target.complete();
        }, 2000);
      } else {
        refresher.target.complete();
      }
    });


  }
  loop_check() {
    this.storage.get('loginStorage').then((result2) => {
      if (result2) {
        this.storage.get("userdata").then((result) => {
          this.responseData = result;
          this.member_avatar = this.responseData.imgprofile;
          if (this.responseData.imgprofile != null && this.responseData.imgprofile != "") {
            this.avatar_welcome = this.responseData.imgprofile;
          } else {
            this.avatar_welcome = "assets/imgs/noimg.png";
          }
          this.fullname_welcome = this.responseData.fullname;
          this.member_level = this.responseData.member_level;
          this.verify_email = this.responseData.verify_email;
          if (this.responseData.member_status == 1) {
            this.member_status = 'Active';
            this.status_color = 'secondary';
          } else if (this.responseData.member_status == 0) {
            this.member_status = 'Inactive';
            this.status_color = 'danger';
          }
          setTimeout(() => {
            this.loop_check();
          }, 5000);
        });
      } else {
        this.avatar_welcome = "assets/imgs/noimg.png";
        this.storage.get('setLanguage').then((result) => {
          if (result == "en") {
            this.fullname_welcome = "Guest";
          } else if (result == "th") {
            this.fullname_welcome = "ผู้เยี่ยมชม";
          }
        });
        setTimeout(() => {
          this.loop_check();
        }, 5000);
      }
    });
  }
  getUserData() {
    this.storage.get('loginStorage').then((result) => {
      // ถ้ามีการล็อกอินเข้ามาแล้ว
      if (result) {
        this.login_status = result;
        this.webService.load_data();
        // ถ้ายังไม่ได้ล็อกอิน
      } else {
        this.storage.get('setLanguage').then((result) => {
          if (result == "en") {
            this.fullname_welcome = "Guest";
          } else if (result == "th") {
            this.fullname_welcome = "ผู้เยี่ยมชม";
          }
        });
        this.avatar_welcome = "assets/imgs/noimg.png";
      }
    });
  }

  async verifyemail() {
    const modal = await this.modalController.create({
      component: VerifyemailPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
  // verifyemail() {
  //   this.router.navigate(['verifyemail']);

  //   // this.app.getRootNav().push(VerifyemailPage);
  // }

  editProfile() {
    this.router.navigate(['edit-profile']);
  }

}
