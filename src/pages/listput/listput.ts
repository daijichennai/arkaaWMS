import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
//import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';
//import { SQLiteObject, SQLite } from '@ionic-native/sqlite';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-listput',
  templateUrl: 'listput.html',
})
export class ListputPage {
  putJson: any = [];
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private http: HttpClient,
      private loadingCtrl: LoadingController,
      private myFunc: CommfuncProvider
  )
   {
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }
  
  ionViewDidLoad() {
    this.getListPut();
    // this.getData();
  }

  getListPut() {
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "handlers/putMaster.ashx?mode=selectList";
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.putJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
        //alert('Error');
      });
    });
  }

  goToPutDetails(putID,putNo){
    this.navCtrl.push('PutdetailsPage',{
      "putID" : putID,
      "putNo" :putNo
    })
  }

  // getData() {
  //   this.sqlite.create({
  //     name: 'ionicdb.db',
  //     location: 'default'
  //   }).then((db: SQLiteObject) => {
  //     db.executeSql('SELECT * FROM putMaster INNER JOIN putDetails ON putMaster.putID = putDetails.putID', []).then(res => {
  //       this.putJson = [];
  //       for (var i = 0; i < res.rows.length; i++) {
  //         this.putJson.push({ 
  //           putID: res.rows.item(i).putID,
  //           putNo: res.rows.item(i).putNo,
  //           itemCode: res.rows.item(i).itemCode,
  //           itemName: res.rows.item(i).itemName,
  //           suggestedLocation: res.rows.item(i).suggestedLocation,
  //           itemQty: res.rows.item(i).itemQty,
  //          })
  //       }
  //       //alert("Select = " + JSON.stringify(res));
  //       //alert(res.rows.item(0).putNo);
  //     }).catch(e => console.log(e));
  //   }).catch(e => console.log(e));
  // }

}
