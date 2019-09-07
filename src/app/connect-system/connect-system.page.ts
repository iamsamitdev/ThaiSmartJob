import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';


@Component({
  selector: 'app-connect-system',
  templateUrl: './connect-system.page.html',
  styleUrls: ['./connect-system.page.scss'],
})
export class ConnectSystemPage implements OnInit {
  payment = 300;
  day = '30';
  src = "https://www.thaismartjob.com/assets/backend/images/pay300.jpg";
  constructor(
    private router: Router,
    private file: File,
    private webService: WebapiServiceProvider,
    private transfer: FileTransfer,
    private photoViewer:PhotoViewer
  ) { }
  ngOnInit() {
  }
  download() {
    const ROOT_DIRECTORY = this.file.externalRootDirectory+"Pictures/";
    const downloadFolderName = "ThaiSmartjob";
    this.file.createDir(ROOT_DIRECTORY, downloadFolderName, true).then((entries) => {
      // this.webService.Toast(JSON.stringify(entries));
      // this.file.copyFile(this.file.applicationDirectory + "www/assets/imgs/", "pay" + this.payment + ".jpg", ROOT_DIRECTORY + downloadFolderName + "//", "pay" + this.payment + ".jpg")

      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download("https://www.thaismartjob.com/assets/backend/images/pay" + this.payment + ".jpg", ROOT_DIRECTORY + downloadFolderName + "/pay" + this.payment + ".jpg").then((entry) => {
        // console.log('download complete: ' + entry.toURL());
        // refreshMedia.refresh( ROOT_DIRECTORY + downloadFolderName + "/pay" + this.payment + ".jpg");
        this.webService.Toast("ดาวโหลดลงเครื่องเรียบร้อยแล้ว");
      }, (error) => {
        this.webService.Toast('1 error ' + JSON.stringify(error.nativeUrl));
        // handle error
      });

      // this.file.copyFile( "https://www.thaismartjob.com/assets/backend/images/", 
      // "pay" + this.payment + ".jpg", ROOT_DIRECTORY + downloadFolderName + "//", "pay" + this.payment + ".jpg")
      //   .then((entries2) => {
      //     this.webService.Toast("ดาวโหลดลงเครื่องเรียบร้อยแล้ว");
      //   }).catch((error) => {
      //     this.webService.Toast('1 error ' + JSON.stringify(error.nativeUrl));
      //   });
    }).catch((error) => {
      this.webService.Toast('Error' + JSON.stringify(error));
    });


  }
  close() {
    // this.navCtrl.pop();
    this.router.navigate(['/']);
  }
  confirm_payment() {
    this.router.navigate(['confirm-payment', { day: this.day, payment: this.payment }]);
  }
  view(img) {
    this.photoViewer.show(img);
  }
  change_day(day) {
    console.log(day);

    if (day == '30') {
      this.payment = 300;
      this.src = "https://www.thaismartjob.com/assets/backend/images/pay300.jpg";
    } else if (day == '100') {
      this.payment = 900;
      this.src = "https://www.thaismartjob.com/assets/backend/images/pay900.jpg";
    } else if (day == '200') {
      this.payment = 1800;
      this.src = "https://www.thaismartjob.com/assets/backend/images/pay1800.jpg";
    } else if (day == '300') {
      this.payment = 2700;
      this.src = "https://www.thaismartjob.com/assets/backend/images/pay2700.jpg";
    } else if (day === '400') {
      this.payment = 3600;
      this.src = "https://www.thaismartjob.com/assets/backend/images/pay3600.jpg";
    }


  }
}
