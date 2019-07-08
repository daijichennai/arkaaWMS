import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-putdetails',
  templateUrl: 'putdetails.html',
})
export class PutdetailsPage {
  putDetailsJson: any = [];
  public intPutID;
  public strPutNo:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider
)
 {
   this.intPutID = this.navParams.get("putID");
   this.strPutNo = this.navParams.get("putNo");
   console.log(this.intPutID);
}

goToAddPutDetails(putDetailsID,putNo){
  this.navCtrl.push('AddputPage',{
    "putDetailsID" : putDetailsID ,
    "putNo" :putNo
  });
}

  ionViewDidLoad() {
    this.getPutDetailsyID(this.intPutID);
  }

  getPutDetailsyID(putID) {
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "handlers/putMaster.ashx?mode=selectByID&putID=" + putID;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.putDetailsJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
        //alert('Error in List Claim');
      });
    });
  }

}
