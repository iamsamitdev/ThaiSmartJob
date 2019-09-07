import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { Device } from '@ionic-native/device/ngx';
import { WebapiServiceProvider } from './providers/webapi-service/webapi-service';
import { HttpModule } from '@angular/http';
import { GlobalProvider } from './providers/global/global';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';

import { Camera } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { UpgradeAlertPage } from './upgrade-alert/upgrade-alert.page';
import { File } from '@ionic-native/file/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ReadNotiPage } from './read-noti/read-noti.page';
import { RemovehtmltagPipe } from './removehtmltags.pipe';
import { LoginReset1Page } from './login-reset1/login-reset1.page';
import { ShowpaymentPage } from './showpayment/showpayment.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { VerifyemailPage } from './verifyemail/verifyemail.page';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { SerachUserPage } from './serach-user/serach-user.page';
import { ConfirmAdddayConfirmPage } from './confirm-addday-confirm/confirm-addday-confirm.page';
import { ContactPage } from './contact/contact.page';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [AppComponent, UpgradeAlertPage, ReadNotiPage, RemovehtmltagPipe, LoginReset1Page, ShowpaymentPage, VerifyemailPage, SerachUserPage, ConfirmAdddayConfirmPage, ContactPage],
  entryComponents: [UpgradeAlertPage, ReadNotiPage, LoginReset1Page, ShowpaymentPage, VerifyemailPage, SerachUserPage, ConfirmAdddayConfirmPage, ContactPage],
  imports: [BrowserModule, HttpModule,
    HttpClientModule,
    ReactiveFormsModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,

    IonicStorageModule.forRoot(),
    IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    AppAvailability,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network,
    FCM,
    Device, WebapiServiceProvider, GlobalProvider,
    BarcodeScanner, DatePicker, Camera, FilePath, CallNumber, File,
    FileTransfer, ImagePicker, PhotoViewer, InAppBrowser, Clipboard
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
