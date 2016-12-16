import { UsuariosService } from '../../providers/usuarios-service';
import { CambiaPasswordPage } from '../cambia-password/cambia-password';
import { AuthService } from '../../providers/auth-service';
import { IUsuario } from '../../model/usuario';
import { Component } from '@angular/core';
import { Events, ModalController, NavController, Platform, ToastController } from 'ionic-angular';

import { Camera, CameraOptions } from 'ionic-native';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {
  usuario: IUsuario;

  constructor(public navCtrl: NavController, public authService: AuthService,
    public usuariosService: UsuariosService, public toast: ToastController,
    public events: Events, public modalCtrl: ModalController,
    private platform: Platform) {}

  ionViewDidLoad() {
     this.authService.getLoggedUser()
        .subscribe(
        usuario => this.usuario = usuario,
        error => console.error(error)
     );
  }

  cambiaPass() {
    let modal = this.modalCtrl.create(CambiaPasswordPage, { idUser: this.usuario.id });
    modal.onDidDismiss(data => {
      if(data.changed) this.showToast(3000, "La contraseña se ha actualizado correctamente");
      else if(data.error) this.showToast(3000, data.error);
    });
    modal.present();
  }

  cambiaAvatar() {
    if (!this.platform.is('cordova')) {
      this.showToast(3000, "Funcionalidad no soportada en navegador");
      return;
    }

    let options: CameraOptions = {
      destinationType: Camera.DestinationType.DATA_URL,
      cameraDirection: Camera.Direction.FRONT,
      targetWidth: 320
    };

    Camera.getPicture(options).then(imageData => {
      let base64 = 'data;image/jpeg;base64,' + imageData;
      this.usuariosService.cambiaAvatar(this.usuario.id, base64)
        .subscribe(
          (user) => {
            this.authService.setLoggedUser(user);
            this.usuario = user;
            this.events.publish('user:logged', user);
          },
          (error) => this.showToast(3000, error)
        );
    });
  }

  private showToast(duration: number, message: string) {
    let toast = this.toast.create({
      duration,
      message
    });
    toast.present();
  }

}
