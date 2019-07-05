import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
 public dataCount;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private storage: Storage,
      public sqlite: SQLite,
    ) {
  }

  ionViewDidLoad() {
  }

  


  // getData(){
  //   this.sqlite.create({
  //     name: 'ionicdb.db',
  //     location: 'default'
  //   }).then((db: SQLiteObject) => {
  //     db.executeSql('SELECT COUNT(putID) AS putCount FROM putMaster', []).then(res => {
  //       alert("Select = " + JSON.stringify(res));
  //       this.dataCount = res.rows.item(0).count;
  //       //alert(res.rows.item(0).count);
  //     }).catch(e => console.log(e));
  //   }).catch(e => console.log(e));
  // }

  // insertRecords(no){
  //   //for (let i = 1; i <= 5; i++) {
  //     this.sqlite.create({
  //       name: 'ionicdb.db',
  //       location: 'default'
  //     }).then((db: SQLiteObject) => {
  //       db.executeSql('INSERT INTO putMaster VALUES(?,?)', [no, "putNo00" + no])
  //         .then(res => {
  //           alert('Sucess Insert = ' + JSON.stringify(res));
  //           console.log(res);

  //         }).catch(e => {
  //           alert('Error in line 51 = ' + JSON.stringify(e));
  //           //console.log(e);
  //         });
  //     }).
  //       catch(error => {
  //         alert('Error in line 56 = ' + JSON.stringify(error));
  //         //alert(JSON.stringify(error));
  //         console.log(error);
  //       });
  //   //}
  // }


goToPustList(){
  this.navCtrl.push('ListputPage');
}

  logOut(){
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
    this.navCtrl.setRoot("LoginPage");
  }

}
