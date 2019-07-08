import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
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
    public sqlite: SQLite,
    ) {

    this.authForm = fb.group({
       'chkUserName': [null, Validators.compose([Validators.required])],
      // 'chkUserPassword': [null, Validators.compose([Validators.required])]
      //'chkUserName': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      'chkUserPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  ionViewDidLoad() {
    this.createLocalDataBase();
  }

  chkLogin() {
    let loader = this.loadingCtrl.create({
      content: 'Verifying User.....'
    });
    if ((this.userName === "user1" || this.userName === "user2") && (this.userPassword === "123456789")) {
      this.storage.set('lsUserName', this.userName);
      this.storage.set('lsUserPwd', this.userPassword);
      
      //this.insertRecords();
      this.navCtrl.setRoot('HomePage');
    }else{
      this.toastMsgFn('User Name or Password is Invalid');
    }
    loader.dismiss();
  }


  createLocalDataBase() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS putMaster(putID TEXT, putNo TEXT)', []).then(res => {
        // alert(JSON.stringify(res));
        // alert('PutMaster Executed SQL');
      }).catch(e => {
        alert('Error in line 71 = ' + JSON.stringify(e));
        console.log(e);
      });
    }).catch(e => console.log(e));

    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS putDetails(putID TEXT, itemCode TEXT, itemName TEXT, suggestedLocation TEXT, itemQty TEXT)', []).then(res => {
        // alert(JSON.stringify(res));
        // alert('PutMaster Executed SQL');
      }).catch(e => {
        alert('Error in line 84 = ' + JSON.stringify(e));
        console.log(e);
      });
    }).catch(e => console.log(e));

  }

  insertRecords() {
    for (let i = 1; i <= 5; i++) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO putMaster VALUES(?,?)', [i, "putNo00" + i])
        .then(res => {
          //alert('Sucess Insert = ' + JSON.stringify(res));
          console.log(res);

        }).catch(e => {
          alert('Error in line 103 = ' + JSON.stringify(e));
          //console.log(e);
        });
    }).
      catch(error => {
        alert('Error in line 56 = ' + JSON.stringify(error));
        //alert(JSON.stringify(error));
        console.log(error);
      });
      this.insertPutDetails(i,"00"+i,"itemName"+i,"BC1R"+i ,i);
    }
  }


  insertPutDetails(putID, itemCode, itemName, suggestedLocation, itemQty){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO putDetails VALUES(?,?,?,?,?)', [putID, itemCode, itemName, suggestedLocation, itemQty])
        .then(res => {
          //alert('Sucess Insert = ' + JSON.stringify(res));
          console.log(res);

        }).catch(e => {
          alert('Error in line 51 = ' + JSON.stringify(e));
          //console.log(e);
        });
    }).
      catch(error => {
        alert('Error in line 133 = ' + JSON.stringify(error));
        //alert(JSON.stringify(error));
        console.log(error);
      });
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
