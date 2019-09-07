import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

import { Platform } from '@ionic/angular';

import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  slides = [
    {
      // title: "ยินดีต้อนรับสู่ ThaiSmartJob",
      // description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/imgs/intro/intro1.jpg",
    },
    {
      // title: "What ThaisamrtJob do?",
      // description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/imgs/intro/intro2.jpg",
    },
    {
      // title: "How to work with us?",
      // description: "The <b>ThaiSmartJob</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/imgs/intro/intro3.jpg",
    },
    {
      // title: "How to work with us?",
      // description: "The <b>ThaiSmartJob</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/imgs/intro/intro4.jpg",
    }
    // {
    //   // title: "How to work with us?",
    //   // description: "The <b>ThaiSmartJob</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
    //   image: "assets/imgs/intro/intro2.jpg",
    // }
  ];
  constructor(
   
    public platform: Platform,

    public webService: WebapiServiceProvider,
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {

  }
  gotoFindSponsor() {
   
      this.storage.set('introShow1', true);
      // this.router.navigate(['findsponsor']);
      // this.navCtrl.setRoot(FindsponsorPage);
      // this.storage.set('introShow1', true);
      this.router.navigate(['/']);
      // เริ่มต้นกำหนดภาาษาไทยเข้าไป
      // this.storage.set('setLanguage', this.lang);

  }
}
