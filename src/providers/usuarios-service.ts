import { SERVER_URL } from '../app/app.constants';
import { IUsuario } from '../model/usuario';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class UsuariosService {

 constructor(public http: AuthHttp) {}

  cambiaAvatar(idUser: number, avatar: string): Observable<IUsuario> {
    return this.http.put(SERVER_URL + `/usuarios/${idUser}/avatar`, {avatar})
      .map((response: Response) => {
        return response.json().data;
      })
      .catch((response: Response) => {
        return Observable.throw("Error cambiando el avatar")
      })
  }

  cambiaPass(idUser: number, password: string): Observable<boolean> {
    return this.http.put(SERVER_URL + `/usuarios/${idUser}/password`, {password})
      .map((response: Response) => {
        return true;
      })
      .catch((response: Response) => {
        return Observable.throw("Error cambiando la contraseña")
      })
  }
}
