// import { Http, Headers } from '@angular/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { GlobalProvider } from '../global/global';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class WebapiServiceProvider {
  constructor(
    public http: Http,
    private toast: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private network: Network,
    private platform: Platform,
    private device: Device,
    private translate: TranslateService,
    private global: GlobalProvider) {
    //
  }

  async  presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    return await alert.present();
  }
  async presentToast() {
    const toast = await this.toast.create({
      message: this.global.msgStatusCodeAPI_0,
      duration: 3000
    });
    toast.present();
  }
  async Toast(text) {
    const toast = await this.toast.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }
  on_loading() {
    this.translate.get('wait').subscribe(wait => {
      this.on_loading2(wait);
    });
  }
  async  on_loading2(wait) {
    let loading = await this.loadingCtrl.create({
      message: wait,
      spinner: 'crescent',
      duration: 2000
    });
    return await loading.present();
  }
  // POST Method

  load_data() {

    this.storage.get('localID').then((result) => {
      if (result) {

        if (this.network.type !== "none") {
          let uuid = 'browser';
          if (!this.platform.is('desktop')) {
            uuid = this.device.uuid;
          }
          this.getData("users/index", result + '/' + uuid).then((result: any) => {
            if (result.logout == '1') {
              this.translate.get('divice_use').subscribe(divice_use => {
                this.translate.get('logou_use').subscribe(logou_use => {
                  this.presentAlert(divice_use, logou_use);
                  setTimeout(() => {
                    this.logout();
                  }, 2000);
                });
              });


            } else {
              this.storage.set("userdata", result);
            }

          }, (error) => {
            if (error.status == 0) {
              this.translate.get('send_error').subscribe(send_error => {
                this.Toast(send_error);
              });

            }
          });

        } else if (this.network.type === 'none') {
          this.translate.get('not_internet').subscribe(not_internet => {
            this.Toast(not_internet);
          });

        }
      }
    });

    // ถ้ายังไม่ได้ล็อกอิน

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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
    });
    this.storage.remove('loginStorage');
    this.storage.remove('localID');


  }
  postData(objdata, segment) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
      // headers.append("Accept", 'application/json');
      // headers.append('Content-Type', 'application/json');
      // let headers = new Headers();
      // headers.append('Content-Type', this.global.contentType);
      // headers.append('Authorization', this.global.authKey);
      const requestOptions = new RequestOptions({ headers: headers });
      this.storage.get('setLanguage').then((result) => {
        this.http.post(this.global.baseUrlApi + segment + "_post?lang=" + result, JSON.stringify(objdata), requestOptions)
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            if (err.status == 0) {
              this.presentToast();
              reject(err);
            }
          });
      });
    });
  }
  // GET METHOD
  getData(segment, s2) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      // headers.append('Content-Type', this.global.contentType);
      // headers.append('Authorization', this.global.authKey);
      // headers.append('Accept', 'application/json, text/plain, */*');

      // var headers = new Headers();
      // // headers.append("Accept", 'application/json');
      // // // headers.append('Content-Type', 'application/json');
      // // // let headers = new Headers();
      // headers.append('Content-Type', this.global.contentType);
      // headers.append('Authorization', this.global.authKey);


      // let options = new RequestOptions({ headers: headers });
      // this.http.get(this.global.baseUrlApi + segment, { headers: headers }) 
      this.storage.get('setLanguage').then((result) => {
        this.http.get(this.global.baseUrlApi + segment + "_get/" + s2 + "?lang=" + result, { headers: headers })
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            if (err.status == 0) {
              this.presentToast();
              reject(err);
            }
            reject(err);
          });
      });
    });
  }

}
