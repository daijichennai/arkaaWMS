import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@IonicPage()
@Component({
  selector: 'page-listpick',
  templateUrl: 'listpick.html',
})
export class ListpickPage {
  pickJson: any = [];
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private http: HttpClient,
      private loadingCtrl: LoadingController,
      private myFunc: CommfuncProvider
  )
   {
  }


  ionViewDidLoad() {
    this.getListPick() ;
  }

  goToPickDetails(pickID,pickNo){
    this.navCtrl.push('PickdetailsPage',{
      "pickID": pickID,
      "pickNo": pickNo
    });
  }

  getListPick() {
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "handlers/putMaster.ashx?mode=selPickList";
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.pickJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
      });
    });
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

}
