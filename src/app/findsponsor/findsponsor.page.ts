import { Component, OnInit, ViewChild } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { GlobalProvider } from '../providers/global/global';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-findsponsor',
  templateUrl: './findsponsor.page.html',
  styleUrls: ['./findsponsor.page.scss'],
})
export class FindsponsorPage implements OnInit {
  unit = '1';
  @ViewChild('searchinput') SearchInput;
  isOn: boolean;
  findbytype: string;
  placeholder_text: string;
  sponsorData = { findbytype: "userid", search_text: "", search_text2: 0 };
  responseData: any;
  member_family_code: string;
  sponsor_id: string;
  fullname: string;
  email: string;
  mobile: string;
  imgprofile: string;
  sponsor_status: string;
  sponsor_status_text: string;
  type = "userid";
  search_text2: number;
  constructor(
    private network: Network,
    private webService: WebapiServiceProvider,
    public global: GlobalProvider,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.radioChecked('userid');
    }, 1000);

  }
  radioChecked(val) {
    this.sponsorData.search_text = "";
    if (val == "userid") {
      this.type = "userid";
      this.translate.get("push_userid").subscribe(push_userid => {
        this.placeholder_text = push_userid;
      });

      // this.SearchInput.setFocus();
    } else if (val == "phone_number") {
      this.type = "phone_number";
      this.translate.get("push_phone").subscribe(push_phone => {
        this.placeholder_text = push_phone
      });

      //this.placeholder_text = this.global.baseUrlApi;
      // this.SearchInput.setFocus();
    }
  }
  findsponser() {
    if (this.sponsorData.search_text != "" && this.type == 'userid' || this.sponsorData.search_text2 != 0 && this.sponsorData.search_text2 != null && this.type == 'phone_number') {
      // เช็คว่ามีการเชื่อมต่อ network หรือยัง
      if (this.network.type !== "none") {

        // if (!this.platform.is('core')) {

        this.webService.postData(this.sponsorData, 'users/findsponsor').then((result) => {
          this.set_result(result);
        }, (error) => {
          //console.log(error);
        });
        //}
      } else if (this.network.type === 'none') {
        this.global.noNetworkConnection();
      }

    } else {
      this.translate.get("error").subscribe(error => {
        this.translate.get("push_data").subscribe(push_data => {
          this.webService.presentAlert(error, push_data);
        });

      });

    }

  }

  gotoHome() {
    this.router.navigate(['/']);
    // this.navCtrl.setRoot(TabsPage);
  }
  closeModal() {
    this.router.navigate(['/']);
  }
  register() {
    this.router.navigate(['register', {
      sponsor_id: this.sponsor_id
    }]);
  }
  set_result(result) {
    this.responseData = result;
    if (this.responseData.username != "") {
      this.isOn = true;
      this.fullname = this.responseData.fullname;
      this.email = this.responseData.email;
      this.mobile = this.responseData.mobile;

      if (this.responseData.imgprofile == "") {
        this.imgprofile = "assets/imgs/noimg.png";
      } else {
        this.imgprofile = this.responseData.imgprofile;
      }

      this.sponsor_status = this.responseData.member_status;

      if (this.responseData.member_status == '0') {
        this.translate.get("inactive").subscribe(inactive => {
          this.sponsor_status_text = "<font color='red'>" + inactive + "</font>";
        });

      }
      if (this.responseData.member_status == '2') {
        this.translate.get("member_full").subscribe(member_full => {
          this.sponsor_status_text = "<font color='red'>" + member_full + "</font>";
        });

      }

      this.member_family_code = this.responseData.member_family_code;
      this.sponsor_id = this.responseData.id;

    } else {
      this.translate.get("error").subscribe(error => {
        this.translate.get("not_sopnsor").subscribe(not_sopnsor => {
          this.webService.presentAlert(error, not_sopnsor);
        });
      })

      this.isOn = false;
    }
  }

  scan() {
    this.barcodeScanner.scan().then((barcodeData) => {
      if (barcodeData.text != "") {
        if (barcodeData.text.startsWith("https://thaismartjob.com?id=")) {
          let a = { findbytype: "userid", search_text: barcodeData.text.split("=")[1], search_text2: 0 };

          this.webService.postData(a, 'users/findsponsor').then((result) => {
            this.set_result(result);
          }, (error) => {
            //console.log(error);
          });

          // this.router.navigate(['register', {
          //   sponsor_id: barcodeData.text.split("=")[1]
          // }])
        } else {
          this.translate.get("error").subscribe(error => {
            this.translate.get("qrcode_invalid").subscribe(qrcode_invalid => {
              this.webService.presentAlert(error, qrcode_invalid);
            });

          });


        }
        // Success ! Barcode data is here

        // this.navCtrl.push(SignupPage, {
        //   family_code: this.member_family_code,
        //   sponsor_id: this.sponsor_id
        // });
      }

    }, (err) => {
      // An error occured
    });
  }

}
