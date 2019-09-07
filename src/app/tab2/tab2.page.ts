import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { SerachUserPage } from '../serach-user/serach-user.page';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  lang: any;
  login_status: any;
  tsteam: string = "downline";
  isAndroid: boolean = false;
  responseNotfound = "";
  downline_res: any;
  count_member = '0';
  upline_res: any = {
    imgprofile: '',
    fullname: '',
    birthdate: '', mobile: '', lineid: '', fbprofile: ''
  };
  show_search: boolean = false;
  search_upline: string = "";
  search_downline: string = "";
  constructor(
    public platform: Platform,
    public storage: Storage,
    public translate: TranslateService,
    private network: Network,
    private router: Router,
    private webService: WebapiServiceProvider,
    private modalController: ModalController
  ) {
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.login_status = result;
        this.getTeamData('all');
      }
    });
    this.isAndroid = platform.is('android');
  }
  async search() {
    const modal = await this.modalController.create({
      component: SerachUserPage
    });
    return await modal.present();
  }
  parent_member(member_id, name) {
    console.log(member_id);
    // this.navCtrl.push(TeamListPage, { member_id: member_id, name: name });
    this.router.navigate(['team-list', { member_id: member_id, name: name }])

    // this.app.getRootNav().push(TeamListPage, { member_id: member_id });
  }
  ionViewWillEnter() {
    // ถ้าเข้าระบบแล้วเท่านั้น
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.login_status = result;
        this.getTeamData('all');
      } else {
        this.login_status = false;
      }
    });
  }
  search_show() {
    this.show_search = !this.show_search;
  }
  doRefresh(refresher) {
    // begin

    // end
    // ถ้าเข้าระบบแล้วเท่านั้น
    this.storage.get('loginStorage').then((result) => {
      if (result) {
        this.getTeamData(this.tsteam);
      }
    });
    setTimeout(() => {
      refresher.target.complete();
    }, 2000);
  }

  getTeamData(type) {
    switch (type) {
      case 'all':
        // เช็คว่ามีการเชื่อมต่อ network หรือยัง
        if (this.network.type !== "none") {
          // Connect Web API
          this.storage.get('localID').then((user_id) => {
            this.webService.getData("users/get_count_downline", user_id).then((result: any) => {
              this.count_member = result;
            });


            this.webService.getData("users/list", "upline/" + user_id).then((result) => {
              console.log(result);
              this.upline_res = result;
            }, (error) => {
              this.translate.get('send_error').subscribe(send_error => {
                this.responseNotfound = send_error;
                console.log(error);
                if (error.status == 0) {
                  this.translate.get('not_internet').subscribe(not_internet => {
                    this.webService.Toast(not_internet);
                  });

                }
              });

            });
            this.webService.getData("users/list", "downline/" + user_id).then((result) => {
              console.log(result);
              this.downline_res = result;
            }, (error) => {
              this.translate.get('send_error').subscribe(send_error => {
                this.responseNotfound = send_error;
                console.log(error);
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
        break;
      case 'upline':
        // เช็คว่ามีการเชื่อมต่อ network หรือยัง
        if (this.network.type !== "none") {
          // Connect Web API
          this.storage.get('localID').then((user_id) => {
            this.webService.getData("users/list", "upline/" + user_id).then((result) => {
              console.log(result);
              this.upline_res = result;
            }, (error) => {
              this.translate.get('send_error').subscribe(send_error => {
                this.responseNotfound = send_error;
                console.log(error);
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
        break;
      case 'downline':
        // เช็คว่ามีการเชื่อมต่อ network หรือยัง
        if (this.network.type !== "none") {
          // Connect Web API
          this.storage.get('localID').then((user_id) => {
            this.webService.getData("users/list", "downline/" + user_id).then((result) => {
              console.log(result);
              this.downline_res = result;
            }, (error) => {
              this.translate.get('send_error').subscribe(send_error => {
                this.responseNotfound = send_error;
                console.log(error);
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
        break;
    }
  }

  login() {
    this.router.navigate(['login']);
  }

}
