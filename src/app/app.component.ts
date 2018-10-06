import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { FCM } from '@ionic-native/fcm';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AboutPage } from '../pages/about/about'
import { HomePage } from '../pages/home/home'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') navCtrl: NavController;

  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public fcm: FCM, private http: HttpClient, public toast:ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      fcm.onNotification().subscribe( data => {
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          console.log(JSON.stringify(data));
          this.navCtrl.setRoot(HomePage);
        }else{
          //Notification was received in foreground. Maybe the user needs to be notified.
          console.log(JSON.stringify(data));
          this.navCtrl.push(AboutPage);
        }
      });

      this.fcm.getToken().then(token => {
        let data = {
          device_id : token
        }

        let headers = { headers: new HttpHeaders().set('Authorization', 'Bearer token') };

        this.http.put('url', data, headers).subscribe(data => {
          console.log(data)
        },
        error => {
          console.log(error)
        })
      });
    });
  }
}
