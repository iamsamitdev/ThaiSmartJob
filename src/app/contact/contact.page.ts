import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebapiServiceProvider } from '../providers/webapi-service/webapi-service';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../providers/global/global';
import { LoadingService } from '../providers/global/loading.service';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  picToView = '';
  data = {
    title: '',
    description: '',
    url: '',
    fullname: '',
    email: '',
    id: ''
  }
  constructor(
    private modalCtrl: ModalController,
    private camera: Camera,
    private actionSheetController: ActionSheetController,
    private webService: WebapiServiceProvider,
    private storage: Storage,
    private global: GlobalProvider,
    private loading: LoadingService,
    private router: Router,
    private alertController: AlertController,
    private network: Network,
    private transfer: FileTransfer,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
  }
  close() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  contact() {
    this.storage.get("userdata").then((result) => {
      console.log(result);
      console.log(this.data);
      this.data.fullname = result.fullname;
      this.data.email = result.email;
      this.data.id = result.id;
      this.loading.present();
      if (this.picToView != '') {
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
          fileKey: "photo",
          fileName: "image.jpg",
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {}
        }
        fileTransfer.upload(this.picToView, this.global.baseUrlApi + "users/upload_file", options).then((data: any) => {
          let result = JSON.parse(data.response);
          if (result.flag) {
            this.data.url = result.url;
            this.add_contact(this.data);
          } else {
            this.webService.Toast("Upload Error ");
          }
          // loader.dismiss();
        }, error => {
          this.webService.Toast("Upload Error " + error);

        });
      } else {
        this.add_contact(this.data);
      }

    });

  }
  add_contact(data) {
    this.webService.postData(data, 'users/contact').then((result2: any) => {
      if (result2 - 0 == 1) {
        this.loading.dismiss();
        this.translate.get("contact_success").subscribe(contact_success => {
          this.webService.Toast(contact_success);
          this.close();
        });

      } else {
        this.loading.dismiss()
        this.translate.get("send_error").subscribe(send_error => {
          this.webService.Toast(send_error);
        });

      }
    });
  }
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true,
      allowEdit: false
    }
    this.camera.getPicture(options).then((imagePath) => {
      this.picToView = 'data:image/jpeg;base64,' + imagePath;

    }, (err) => {
      this.translate.get("select_error").subscribe(select_error => {
        this.webService.Toast(select_error);
      });

    });
  }
  add_slip() {
    this.translate.get("select_picture").subscribe(select_picture => {
      this.translate.get("select_gallery").subscribe(select_gallery => {
        this.translate.get("camara").subscribe(camara => {
          this.translate.get("close").subscribe(close => {
            this.add_slip2(select_picture, select_gallery, camara, close);
          });
        })

      });
    });
  }
  async add_slip2(select_picture, select_gallery, camara, close) {
    const actionSheet = await this.actionSheetController.create({
      header: select_picture,
      buttons: [{
        text: select_gallery,
        role: 'destructive',
        icon: 'images',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: camara,
        icon: 'camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: close,
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
