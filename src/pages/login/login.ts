import { TareasPage } from '../tareas/tareas';
import { AuthService } from '../../providers/auth-service';
import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, public authService: AuthService,
              public alertCtrl: AlertController) { }

  ionViewDidLoad() { 
    this.authService.isLogged().subscribe(
      (ok) => { 
        if(ok) this.navCtrl.setRoot(TareasPage);
      }
    )
  }

  login() {
    this.authService.login(this.username, this.password)
      .subscribe(
      () => this.navCtrl.setRoot(TareasPage),
      (error) => this.showErrorLogin(error)
      );
  }

  private showErrorLogin(error) {
    let alert = this.alertCtrl.create({
      title: 'Login error',
      subTitle: error,
      buttons: ['Ok']
    });
    alert.present();
  }
}
