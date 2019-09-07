import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  noti_count = '0';
  extra_count = '0';
  constructor(
    private storage: Storage
  ) {
    this.load_noti();
  }

  ionViewWillEnter() {


  }
  load_noti() {
    this.storage.get('localID').then((result) => {
      if (result) {
        this.storage.get("userdata").then((data) => {
          if (data) {
            this.noti_count = data.noti_count;
            this.extra_count = data.extra_count;
          }
          setTimeout(() => {
            this.load_noti();
          }, 5000);
        });
      } else {
        setTimeout(() => {
          this.load_noti();
        }, 5000);
      }
    });
  }
}
