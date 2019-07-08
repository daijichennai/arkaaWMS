import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-pickdetails',
  templateUrl: 'pickdetails.html',
})
export class PickdetailsPage {

  pickDetailsJson: any = [];
  public intPickID;
  public strPickNo: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider
  ) {
    this.intPickID = this.navParams.get("pickID");
    this.strPickNo = this.navParams.get("pickNo");
    console.log(this.intPickID);
  }
  
  ionViewDidLoad() {
    this.getPickDetailsyID(this.intPickID);
  }

  goToAddPickDetails(pickDetailsID,pickNo){
    this.navCtrl.push("AddpickPage",{
      "pickDetailsID": pickDetailsID,
      "pickNo": pickNo
    });
  }

  getPickDetailsyID(pickID) {
    let data: Observable<any>;
    // alert(custCode);
    let url = this.myFunc.domainURL + "handlers/putMaster.ashx?mode=selectPickList&pickID=" + pickID;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.pickDetailsJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
        //alert('Error in List Claim');
      });
    });
  }

  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }

}
