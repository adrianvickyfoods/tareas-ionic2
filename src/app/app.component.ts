import { PerfilPage } from '../pages/perfil/perfil';
import { Storage } from '@ionic/storage';
import { NuevaTareaPage } from '../pages/nueva-tarea/nueva-tarea';
import { IUsuario } from '../model/usuario';
import { LoginPage } from '../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

declare let cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  loggedUser: IUsuario;
  rootPage: any = LoginPage;

  constructor(public platform: Platform, public events: Events, 
              public storage: Storage) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if (this.platform.is('cordova')) {
        cordova.plugins.backgroundMode.setDefaults({
          title: "Tareas Ionic",
          text: "Activa en segundo plano"
        });
        cordova.plugins.backgroundMode.enable();
      }

      this.events.subscribe('user:logged', (userData) => {
        this.loggedUser = <IUsuario>userData[0];
      });
    });
  }

  crearTarea() {
    this.nav.push(NuevaTareaPage);
  }

  irPerfil() {
    console.log("Ir perfil");
    this.nav.push(PerfilPage);
  }

  logout() {
    this.storage.remove('auth-token').then(
      () => this.nav.setRoot(LoginPage)
    );
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
