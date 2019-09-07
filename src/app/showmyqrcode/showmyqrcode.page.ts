import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-showmyqrcode',
  templateUrl: './showmyqrcode.page.html',
  styleUrls: ['./showmyqrcode.page.scss'],
})
export class ShowmyqrcodePage implements OnInit {
  getUserID: string;
  qrcodeURL: any;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.getUserID = navParams.get('userid');
    this.getUserID = this.route.snapshot.params['userid'];
    console.log(this.route);
    console.log(this.getUserID);
    this.qrcodeURL = "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://thaismartjob.com?id=" + this.getUserID + "&choe=UTF-8&chld=L|1";
  }

}
