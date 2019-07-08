import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';
//import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

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
      //public sqlite: SQLite,
    ) {
  }

  ionViewDidLoad() {
  }

  goToLog(){
    this.navCtrl.push('LogPage');
  }
  
 

  goToPustList(){
    this.navCtrl.push('ListputPage');
  }

  logOut(){

    // this.sqlite.create({
    //   name: 'ionicdb.db',
    //   location: 'default'
    // }).then((db: SQLiteObject) => {
    //   db.executeSql('DELETE FROM putMaster', [])
    //     .then(res => {
    //       //alert(JSON.stringify(res));
    //       console.log(res);
    //     })
    //     .catch(e => console.log(e));
    // }).catch(e => console.log(e));

    // this.sqlite.create({
    //   name: 'ionicdb.db',
    //   location: 'default'
    // }).then((db: SQLiteObject) => {
    //   db.executeSql('DELETE FROM putDetails', [])
    //     .then(res => {
    //       //alert(JSON.stringify(res));
    //       console.log(res);
    //     })
    //     .catch(e => console.log(e));
    // }).catch(e => console.log(e));
  

    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
    this.navCtrl.setRoot("LoginPage");
  }

}
