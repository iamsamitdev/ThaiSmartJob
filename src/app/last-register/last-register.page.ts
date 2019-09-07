import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-last-register',
  templateUrl: './last-register.page.html',
  styleUrls: ['./last-register.page.scss'],
})
export class LastRegisterPage implements OnInit {
  downline_res: any;
  constructor(
    private network: Network,
    private storage: Storage,
    private webService: WebapiServiceProvider,
    private translate: TranslateService

  ) {
    this.load_register();
  }

  ngOnInit() {
  }
  load_register() {
    if (this.network.type !== "none") {
      this.storage.get('localID').then((user_id) => {
        this.webService.getData("users/last_register", user_id).then((result) => {
          console.log(result);
          this.downline_res = result;
        }, (error) => {
          console.log(error);
          if (error.status == 0) {
            this.translate.get("send_error").subscribe(send_error => {
              this.webService.Toast(send_error);
            })

          }
        });
      });
    } else if (this.network.type === 'none') {
      this.translate.get('not_internet').subscribe(not_internet => {
        this.webService.Toast(not_internet);
      });

    }
  }
}
