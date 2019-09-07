import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-team-last',
  templateUrl: './team-last.page.html',
  styleUrls: ['./team-last.page.scss'],
})
export class TeamLastPage implements OnInit {
  responseNotfound = '';
  teamlast: any;

  constructor(
    private storage: Storage,
    private network: Network,
    private webService: WebapiServiceProvider,
    private router: Router,
    private translate: TranslateService
  ) {
    storage.get('localID').then((result) => {
      this.load_member(result);
    });
  }

  ngOnInit() {
  }
  close_all() {
    this.router.navigate(['tabs/tab2']);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamLastPage');
  }
  parent_member(member_id, name) {
    console.log(member_id);
    // this.navCtrl.push(TeamListPage, { member_id: member_id, name: name });
    this.router.navigate(['team-list', { member_id: member_id, name: name }])

    // this.app.getRootNav().push(TeamListPage, { member_id: member_id });
  }
  load_member(member_id) {
    if (this.network.type !== "none") {
      this.webService.getData("users/last_team", member_id).then((result) => {
        console.log(result);
        this.teamlast = result;
      }, (error) => {
        this.translate.get('send_error').subscribe(send_error => {
          this.responseNotfound = send_error;
          if (error.status == 0) {
            this.translate.get('not_internet').subscribe(not_internet => {
              this.webService.Toast(not_internet);
            });
          }
        });
      });
    }
  }
}
