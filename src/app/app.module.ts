import { UsuariosService } from '../providers/usuarios-service';
import { TareasService } from '../providers/tareas-service';
import { Http } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../providers/auth-service';
import { CambiaPasswordPage } from '../pages/cambia-password/cambia-password';
import { PerfilPage } from '../pages/perfil/perfil';
import { NuevaTareaPage } from '../pages/nueva-tarea/nueva-tarea';
import { TareasPage } from '../pages/tareas/tareas';
import { LoginPage } from '../pages/login/login';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';

let storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    noJwtError: true,
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => storage.get('auth-token'))
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TareasPage,
    NuevaTareaPage,
    PerfilPage,
    CambiaPasswordPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TareasPage,
    NuevaTareaPage,
    PerfilPage,
    CambiaPasswordPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    Storage,
    AuthService,
    TareasService,
    UsuariosService
  ]
})
export class AppModule { }
