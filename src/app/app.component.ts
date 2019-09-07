import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from './providers/webapi-service/webapi-service';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'

})
export class AppComponent {
  userDeviceData = { uuid: "", token: "", platform: "", version: "", member_id: '0' };
  userDeviceResponse: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService,
    private storage: Storage,
    private router: Router,
    private fcm: FCM,
    private device: Device,
    private network: Network,
    private webService: WebapiServiceProvider
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackOpaque();
      this.splashScreen.hide();
    });

    this.storage.get('introShow1').then((result) => {
      if (result) {
        console.log(result);
        // เคยเข้าใช้งานแล้ว
        this.router.navigate(['/']);
        // เข้าใช้งานครั้งแรก
      } else {
        this.router.navigate(['intro']);
      }
    });
    this.translate.setDefaultLang('th');
    // ถ้าเคยเปลี่ยนภาษาให้ดึงจาก local storage
    this.storage.get('setLanguage').then((result) => {
      if (result) {
        this.translate.setDefaultLang(result);
        this.translate.use(result);
        // ถ้ายังไม่เคยเปลี่ยนภาษาให้ใช้ ภาษาไทยเริ่มต้น
      } else {
        if (this.translate.getBrowserLang() !== undefined) {
          let language = this.translate.getBrowserLang();
          this.translate.use(language);
          // console.log('browser language is', this.translate.getBrowserLang());
        }
        else {
          this.translate.use('th');
        }
      }
    });



    // เช็คว่ามีการเชื่อมต่อ network หรือยัง
    if (this.network.type !== "none") {

      /*
      *---------------------------------------------------------------
      *  PUSH NOTIFICATION WITH FIREBASE
      *---------------------------------------------------------------
      */
      // ลงทะเบียน  device เพื่อรับ Token
      this.fcm.subscribeToTopic('all');
      this.fcm.getToken().then(token => {
        if (!this.platform.is('desktop')) {
          this.userDeviceData.token = token;
          // Device info
          this.userDeviceData.uuid = this.device.uuid;
          this.userDeviceData.platform = this.device.platform;
          this.userDeviceData.version = this.device.version;
        } else {
          this.userDeviceData.token = '';
          // Device info
          this.userDeviceData.uuid = 'browser';
          this.userDeviceData.platform = 'web';
          this.userDeviceData.version = '1';
        }
        this.storage.get("userdata").then((data) => {
          if (data) {
            this.userDeviceData.member_id = data.id;
            this.webService.postData(this.userDeviceData, 'users/register_device').then((result) => {
              this.userDeviceResponse = result;
              if (this.userDeviceResponse.Sucess) {
                this.webService.Toast('Regis new device success');
                // Keep UUID to localStorage
                this.storage.set('uuid', this.device.uuid);
              } else {
                this.webService.Toast('Fail! Cannot Regis new device');
              }
            }, (error) => {
              //console.log(error);
              if (error.status == 0) {
                this.webService.Toast('Error status Code:0 Web API Offline');
              }
            });
          } else {
            this.userDeviceData.member_id = '0';
            this.webService.postData(this.userDeviceData, 'users/register_device').then((result) => {
              this.userDeviceResponse = result;
              if (this.userDeviceResponse.Sucess) {
                this.webService.Toast('Regis new device success');
                // Keep UUID to localStorage
                this.storage.set('uuid', this.device.uuid);
              } else {
                this.webService.Toast('Fail! Cannot Regis new device');
              }
            }, (error) => {
              //console.log(error);
              if (error.status == 0) {
                this.webService.Toast('Error status Code:0 Web API Offline');
              }
            });
          }
        });
        // Connect Web API


      }); // then

      // อัพเดท Token
      this.fcm.onTokenRefresh().subscribe(token => {
        this.userDeviceData.token = token;

        // Device info
        this.userDeviceData.uuid = this.device.uuid;
        this.userDeviceData.platform = this.device.platform;
        this.userDeviceData.version = this.device.version;

        // Connect Web API
        this.webService.postData(this.userDeviceData, 'users/register_device').then((result) => {
          this.userDeviceResponse = result;
          if (this.userDeviceResponse.Sucess) {
            this.webService.Toast('Regis new device success');

            // Keep UUID to localStorage
            this.storage.set('uuid', this.device.uuid);

          } else {
            this.webService.Toast('Fail! Cannot Regis new device');
          }
        }, (error) => {
          //console.log(error);
          if (error.status == 0) {
            this.webService.Toast('Error status Code:0 Web API Offline');
          }
        });
      });


    } else if (this.network.type === 'none') {
      this.translate.get('error').subscribe(error => {
        this.translate.get('not_internet').subscribe(not_internet => {
          this.webService.presentAlert(error, not_internet);
        });
      });

    }

  }
}
