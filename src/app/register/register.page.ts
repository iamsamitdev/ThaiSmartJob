import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Network } from '@ionic-native/network/ngx';
import { GlobalProvider } from '../providers/global/global';
import { Events } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  signupForm: FormGroup;
  masks: any;
  userData = {
    uuid: "",
    member_family_code: "",
    sponsor_id: "",
    username: "",
    password: "",
    fullname: "",
    gender: "1",
    birthdate: "",
    email: "",
    mobile: "",
    bank: "kbank",
    bank_account: "",
    paypal_account: "",
    lineid: "",
    fbprofile: ""
  };
  responseData: any;
  get_family_code: any;
  get_sponsor_id: any;
  type_password = 'password';
  constructor(
    public storage: Storage,
    private route: ActivatedRoute,
    private rounter: Router,
    private webService: WebapiServiceProvider,
    private network: Network,
    private global: GlobalProvider,
    private event: Events,
    private translate: TranslateService
  ) {

    this.signupForm = new FormGroup({
      Infousername: new FormControl('', [Validators.required, Validators.pattern('[a-z]*'), Validators.minLength(7), Validators.maxLength(32)]),
      Infopassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      Infofullname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(64)]),
      Infogender: new FormControl('', [Validators.required]),
      Infobirthdate: new FormControl('', [Validators.required, Validators.minLength(10)]),
      Infoemail: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'), Validators.minLength(10)]),
      Infomobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
      Infobank: new FormControl('', []),
      Infoaccnumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      Infopaypal: new FormControl('', []),
      Infolindid: new FormControl('', [Validators.required]),
      Infofbprofile: new FormControl('', [Validators.required])
    });
    // อ่านข้อมูล member_family_code และ sponsor_id จากหน้า findsponsor
    // this.userData.member_family_code = this.route.snapshot.data['family_code'];
    this.userData.sponsor_id = route.snapshot.paramMap.get('sponsor_id');// route.snapshot.data['sponsor_id'];
    console.log(this.userData);
    //this.navParams.get('sponsor_id');

    // อ่านข้อมูล uuid จาก localstorage
    this.storage.get('uuid').then((result) => {
      this.userData.uuid = result;
    });
    // setInterval(() => {
    //   this.findInvalidControls();
    // }, 1000);

  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.signupForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
  }
  ngOnInit() {
  }
  show_pass() {
    if (this.type_password == 'text') {
      this.type_password = "password";
    } else {
      this.type_password = "text";
    }

  }
  signup() {
    // เช็คว่ามีการเชื่อมต่อ network หรือยัง
    if (this.network.type !== "none") {

      // ตรวจว่า เลขบัญชีและ paypal ต้องไม่ว่างทั้ง 2 อย่าง
      if (this.userData.bank_account == '' && this.userData.paypal_account == '') {
        this.translate.get('paypal_or_bank').subscribe(paypal_or_bank => {
          this.translate.get('error').subscribe(error => {
            this.webService.presentAlert(error, paypal_or_bank);
          });
        });



      } else {

        this.webService.on_loading();
        this.webService.postData(this.userData, 'users/register').then((result) => {

          this.responseData = result;
          this.translate.get('error').subscribe(error => {
            if (this.responseData.message == "register_success") {
              // บันทึกลงตัวแปร localStorage
              this.storage.set('loginStorage', true);
              this.storage.set('localID', this.responseData.id);
              this.storage.set('loginStorage', true);
              this.storage.set('loginPersistant', this.responseData.username);
              // this.navCtrl.setRoot(TabsPage);
              setTimeout(() => {
                this.webService.load_data();
                this.event.publish("login", {});
                this.rounter.navigate(['/']);
              }, 100);

            } else if (this.responseData.message == "register_fail") {
              this.translate.get('new_register').subscribe(new_register => {
                this.webService.presentAlert(error, new_register);
              });

            } else if (this.responseData.message == "duplicated_username") {
              this.translate.get('have_user').subscribe(have_user => {
                this.webService.presentAlert(error, have_user);
              });

            } else if (this.responseData.message == "duplicated_email") {
              this.translate.get('have_email').subscribe(have_email => {
                this.webService.presentAlert(error, have_email);
              });

            }
          })



        }, (err) => {
          console.log(err);
        });
      }

    } else if (this.network.type === 'none') {
      this.global.noNetworkConnection();
    } else {

      this.global.noNetworkConnection();

    }
  }
}
