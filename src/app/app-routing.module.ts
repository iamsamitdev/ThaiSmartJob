import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'findsponsor', loadChildren: './findsponsor/findsponsor.module#FindsponsorPageModule' },
  { path: 'upgrade', loadChildren: './upgrade/upgrade.module#UpgradePageModule' },
  { path: 'showmyqrcode', loadChildren: './showmyqrcode/showmyqrcode.module#ShowmyqrcodePageModule' },
  { path: 'connect-system', loadChildren: './connect-system/connect-system.module#ConnectSystemPageModule' },
  { path: 'last-register', loadChildren: './last-register/last-register.module#LastRegisterPageModule' },
  { path: 'noti-upgrade', loadChildren: './noti-upgrade/noti-upgrade.module#NotiUpgradePageModule' },
  { path: 'team-last', loadChildren: './team-last/team-last.module#TeamLastPageModule' },
  { path: 'verifyemail', loadChildren: './verifyemail/verifyemail.module#VerifyemailPageModule' },
  { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'team-list', loadChildren: './team-list/team-list.module#TeamListPageModule' },
  { path: 'confirm-payment', loadChildren: './confirm-payment/confirm-payment.module#ConfirmPaymentPageModule' },
  { path: 'read-noti', loadChildren: './read-noti/read-noti.module#ReadNotiPageModule' },
  { path: 'login-reset1', loadChildren: './login-reset1/login-reset1.module#LoginReset1PageModule' },
  { path: 'showpayment', loadChildren: './showpayment/showpayment.module#ShowpaymentPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'serach-user', loadChildren: './serach-user/serach-user.module#SerachUserPageModule' },
  { path: 'confirm-addday', loadChildren: './confirm-addday/confirm-addday.module#ConfirmAdddayPageModule' },
  { path: 'confirm-addday-confirm', loadChildren: './confirm-addday-confirm/confirm-addday-confirm.module#ConfirmAdddayConfirmPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppRoutingModule { }

