import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.page.html',
  styleUrls: ['./team-list.page.scss'],
})
export class TeamListPage implements OnInit {
  responseNotfound = '';
  teamlast = [];
  title = "";
  member_id = '';
  constructor(
    private network: Network,
    private webService: WebapiServiceProvider,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    this.title = this.route.snapshot.paramMap.get('name');
    this.member_id = this.route.snapshot.paramMap.get('member_id');
    this.load_member(this.member_id);
  }

  ngOnInit() {
  }
  close_all() {
    this.router.navigateByUrl("/tabs/tab2");
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TeamLastPage');
  }
  member_click(member) {
    this.router.navigate(['team-list', { member_id: member.id, name: member.fullname }])
  }
  load_member(member_id) {
    if (this.network.type !== "none") {
      this.webService.getData("users/last_team", member_id).then((result: any) => {
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
