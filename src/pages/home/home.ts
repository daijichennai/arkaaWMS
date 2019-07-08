import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
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
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider,
    public alertCtrl: AlertController,
    private storage: Storage,
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
    let data: Observable<any>;
    let url = this.myFunc.domainURL + "handlers/putMaster.ashx?mode=reset";
    let loader = this.loadingCtrl.create({
      content: 'Resetting Data'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {        
        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
        alert('Error in Reset');
      });
    });    
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
    this.navCtrl.setRoot("LoginPage");
  }

}
