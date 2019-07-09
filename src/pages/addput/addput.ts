import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { CommfuncProvider } from '../../providers/commfunc/commfunc';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-addput',
  templateUrl: 'addput.html',
})
export class AddputPage {
  authForm: FormGroup;
  public intPutDetailsID;
  public putDetailsJson:any =[];
  public hfScanBoxQR:string;
  public hfScanRackQR:string;
  scanBoxQR:string;
  scanRackQR:string;
  itemName:string;
  itemCode:string;
  itemQty:string;
  putID:string;
  strPutNo :string;
  @ViewChild('inputScanBox') myScanBox;
  @ViewChild('inputScanRack') myScanRack;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private myFunc: CommfuncProvider,
    public alertCtrl: AlertController,
    private storage: Storage,
    public fb: FormBuilder,
    private keyboard: Keyboard
)
 {
    this.intPutDetailsID = this.navParams.get("putDetailsID");
    this.strPutNo = this.navParams.get("putNo");
    console.log(this.intPutDetailsID);

    this.authForm = fb.group({
      //'chkScanBoxQR': [null, Validators.compose([Validators.required])],
      'chkScanRackQR': ['', Validators.compose([Validators.required])]
    });

    

}

  ionViewDidEnter() {
    setTimeout(() => {
      this.myScanBox.setFocus();
    }, 150);
  }
  goToHome() {
    this.navCtrl.setRoot('HomePage');
  }
  ionViewDidLoad() {
    this.getPutDetailsyID(this.intPutDetailsID);
    
  }

  lockKeyboard(){
    setTimeout(() => {
      this.myScanRack.setFocus();
    }, 150);
    this.keyboard.hide();
  }

  getPutDetailsyID(putDetailsID) {
    let data: Observable<any>;
    let url = this.myFunc.domainURL + "handlers/putMaster.ashx?mode=selPutDetByID&putDetailsID=" + putDetailsID;
    let loader = this.loadingCtrl.create({
      content: 'Fetching Data From Server...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
       // console.log(result);
        this.putDetailsJson = result;
        this.hfScanBoxQR = result[0].itemCode +"_" + result[0].itemName + "_" + result[0].itemQty;
        this.hfScanRackQR = result[0].suggestedLocation;

        this.itemName = result[0].itemName;
        this.itemCode = result[0].itemCode;
        this.itemQty = result[0].itemQty;
        this.putID= result[0].putID;

        console.log(this.putDetailsJson);

        console.log("itemName = " + this.itemName);
        console.log("itemCode = " + this.itemCode);
        console.log("itemQty  = " + this.itemQty);
        console.log("putID    = " + this.putID);

        // alert(this.hfScanBoxQR);
        // alert(this.hfScanRackQR);

        loader.dismiss();
      }, error => {
        loader.dismiss();
        console.log(error);
        //alert('Error in List Claim');
      });
    });
  }


  submitFn(){
    if(this.hfScanBoxQR === this.scanBoxQR && this.hfScanRackQR === this.scanRackQR){
      //alert("submit");
      let data: Observable<any>;
      let url = '';
      this.storage.get('lsUserName').then((lsUserName) => {
         url = this.myFunc.domainURL + 'handlers/putMaster.ashx?mode=insPut&putID='+ this.putID + "&rackQR=" + this.scanRackQR + "&itemCode=" + this.scanBoxQR + "&itemName=" + this.itemName + "&itemQty=" + this.itemQty + "&userName=" + lsUserName + "&putDetailsID=" + this.intPutDetailsID + "&putNo=" + this.strPutNo + "&logMode=put";
         let loader = this.loadingCtrl.create({
          content: 'Inserting Data'
        });
        data = this.http.post(url, "");
        loader.present().then(() => {
          data.subscribe(result => {
            //alert("success");
            if(result===null){
              //this.navCtrl.pop();
              //this.navCtrl.setRoot("HomePage");
              //this.navCtrl.pop();
              this.navCtrl.push("PutdetailsPage",{
                "putID": this.putID,
                "putNo": this.strPutNo
              });
            }

            console.log(result);         
            
            loader.dismiss();
          }, error => {
            alert("failure");
            console.log(error);
            loader.dismiss();
          });
        });
      });
      
    }else{
      this.alertMsgFn('Invalid Bar Code !...........');
    }

  }

  alertMsgFn(msg){
    let altsuccess = this.alertCtrl.create({
      title: 'Failure 😞',
      message: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });
    altsuccess.present();
  }


}
