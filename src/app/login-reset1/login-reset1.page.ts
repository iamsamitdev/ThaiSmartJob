import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../providers/global/loading.service';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login-reset1',
  templateUrl: './login-reset1.page.html',
  styleUrls: ['./login-reset1.page.scss'],
})
export class LoginReset1Page implements OnInit {
  error = false;
  success2 = false;
  success_text = "";
  email = "";
  member_id = "";
  codesuccess = false;
  error_code = false;
  newpass: FormGroup;
  data = { npass: '', cpass: '' };
  constructor(private modalCtrl: ModalController,
    private loading: LoadingService,
    private webService: WebapiServiceProvider,
    private translate: TranslateService
  ) {

    setTimeout(() => {
      this.success2 = false;
    }, 1000);

    this.newpass = new FormGroup({
      Infopassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      Infocpassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    }, (formGroup: FormGroup) => {
      return this.areEqual(formGroup);
    });
  }
  areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;

    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];
        if (val === undefined) {
          val = control.value
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }
    if (valid) {
      return null;
    }
    return {
      areEqual: true
    }
  }
  ngOnInit() {
  }
  close() {
    this.modalCtrl.dismiss();
  }
  login(form) {
    this.loading.present();

    this.webService.postData(form.value, 'users/resetpass').then((result: any) => {
      console.log(result);
      if (result.flag) {
        this.success2 = true;
        this.error = false;
        this.email = result.data.email;
        this.member_id = result.data.id;
        // this.success_text = "ระบบได้ส่งรหัสไปยัง Email " + result.data.email;
      } else {
        this.success2 = false;
        this.error = true;
      }
      this.loading.dismiss();
    })
    console.log(form.value);
  }
  confirmcode(form) {
    console.log(form.value);
    let data = form.value;
    data.member_id = this.member_id;
    this.webService.postData(data, 'users/comfirm_code').then((result: any) => {
      console.log(result);
      if (result.flag) {
        this.codesuccess = true;
        this.error_code = false;
      } else {
        this.error_code = true;
      }
    })
  }
  change_pass(form) {
    console.log(form);
    let data = form;
    data.member_id = this.member_id;
    this.webService.postData(data, 'users/reset_pass').then((result: any) => {
      console.log(result);
      if (result == '1') {
        this.translate.get('change_success').subscribe(change_success => {
          this.translate.get("please_login").subscribe(please_login => {
            this.webService.presentAlert(change_success, please_login);
            setTimeout(() => {
              this.modalCtrl.dismiss();
            }, 1000);
          });
        })

      } else {
        this.webService.Toast("Error");
      }
    })
  }
}
