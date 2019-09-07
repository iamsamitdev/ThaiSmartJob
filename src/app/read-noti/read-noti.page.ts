import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-read-noti',
  templateUrl: './read-noti.page.html',
  styleUrls: ['./read-noti.page.scss'],
})
export class ReadNotiPage implements OnInit {
  data = { title: '', read: 0, ns_id: 0 };
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private storage: Storage,
    private webService: WebapiServiceProvider,
    private translate: TranslateService
  ) {
    this.data = navParams.get('value');
    console.log(this.data);
    if (this.data.read == 0) {
      this.storage.get('localID').then((result) => {
        this.webService.postData({ ns_id: this.data.ns_id, member_id: result }, 'Notification/read').then((result: any) => {
          if (result - 0 == 1) {
            this.translate.get('readed').subscribe(readed => {
              this.webService.Toast(readed);
              this.webService.load_data();
            });

          } else {
            this.translate.get('send_error').subscribe(send_error => {
              this.webService.Toast(send_error);
            })

          }
        });
      });
    }
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
  ngOnInit() {
  }

}
