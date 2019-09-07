import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateCompiler, TranslateService } from '@ngx-translate/core';

@Injectable()
export class GlobalProvider {

  // local
  // public baseUrl: string = "http://192.168.1.28/thaismartjob/assets/backend/images/user_avatar/";
  // public baseUrlApi: string = "http://192.168.1.28/thaismartjob/api/v1/client/";

  // production
  public baseUrl: string = "https://www.thaismartjob.com/assets/backend/images/user_avatar/";
  public baseUrlApi: string = "https://www.thaismartjob.com/api/v1/client/";

  public authKey: string = "Basic c2FtaXQ6c21rMzc3MDQw";
  public contentType: string = "application/json;charset=UTF-8";
  public msgStatusCodeAPI_0 = "Error status Code:0 Web API Offline";

  constructor(private toast: ToastController, private translate: TranslateService) {
    // 
  }

  presentToast() {
    this.translate.get('not_internet').subscribe(not_internet => {
      this.presentToast2(not_internet);
    });
  }
  async presentToast2(not_internet) {
    const toast = await this.toast.create({
      message: not_internet,
      duration: 3000
    });
    toast.present();
  }
  noNetworkConnection() {
    this.presentToast();
  }

  // production
  // public baseUrlApi:string = "https://thaismartjob.com/api/v1/client/";

}
