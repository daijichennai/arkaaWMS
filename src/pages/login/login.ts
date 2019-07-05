import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  authForm: FormGroup;
  public userPassword: string;
  public userName: string;

  //Start Local Storage variable 
  public lsUserPwd: string;
  public lsUserName: string;
  //End  Local Storage variable 

  public type = 'password';
  public showPass = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    ) {

    this.authForm = fb.group({
      // 'chkUserName': [null, Validators.compose([Validators.required])],
      // 'chkUserPassword': [null, Validators.compose([Validators.required])]
      'chkUserName': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'chkUserPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  chkLogin() {
    let loader = this.loadingCtrl.create({
      content: 'Verifying User.....'
    });
    if ((this.userName === "user1" || this.userName === "user2") && (this.userPassword === "123456789")) {
      this.storage.set('lsUserPwd', this.userName);
      this.storage.set('lsUserName', this.userPassword);
      this.navCtrl.setRoot('HomePage');
    }else{
      this.toastMsgFn('User Name or Password is Invalid');
    }
    loader.dismiss();
  }

  toastMsgFn(msg: string) {
    this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 3000,
    }).present();
  }
 

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

}
