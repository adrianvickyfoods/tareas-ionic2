import { UsuariosService } from '../../providers/usuarios-service';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the CambiaPassword page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cambia-password',
  templateUrl: 'cambia-password.html'
})
export class CambiaPasswordPage {
  idUser: number;
  password: string = '';
  password2: string = '';

  constructor(public viewCtrl: ViewController, public params: NavParams,
              public usuariosService: UsuariosService) {
    this.idUser = Number(params.get('idUser'));
  }

  changePass() {
    this.usuariosService.cambiaPass(this.idUser, this.password)
      .subscribe(
        (ok) => this.viewCtrl.dismiss({changed: true}),
        (error) => this.viewCtrl.dismiss({changed: false, error: error})
      );
  }

  close() {
    this.viewCtrl.dismiss({changed: false});
  }

}
