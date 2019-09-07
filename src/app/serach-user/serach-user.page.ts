import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-serach-user',
  templateUrl: './serach-user.page.html',
  styleUrls: ['./serach-user.page.scss'],
})
export class SerachUserPage implements OnInit {
  teamlast = [];
  flag = false;
  constructor(
    private network: Network,
    private webService: WebapiServiceProvider,
    private storage: Storage,
    private router: Router,
    private modalCtrl: ModalController,
    private translate: TranslateService

  ) { }

  ngOnInit() {
  }
  search(q: string) {
    console.log(q);
    if (this.network.type !== "none") {
      this.storage.get('localID').then((member_id: any) => {
        this.webService.getData("users/search", member_id + "/" + q).then((result: any) => {
          console.log(result);
          this.flag = true;
          this.teamlast = result;
        }, (error) => {
          // this.responseNotfound = "มีบางอย่างผิดพลาดในการดึงข้อมูลจาก Server";
          console.log(error);
          if (error.status == 0) {
            this.translate.get('not_internet').subscribe(not_internet => {
              this.webService.Toast(not_internet);
            });


          }
        });
      })

    }
  }
  close_all() {
    this.modalCtrl.dismiss();
  }
}
