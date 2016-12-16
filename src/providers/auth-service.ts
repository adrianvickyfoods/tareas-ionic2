import { AuthHttp } from 'angular2-jwt';
import { IUsuario } from '../model/usuario';
import { SERVER_URL } from '../app/app.constants';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class AuthService {
  private loggedUser: IUsuario = null;

  constructor(public http: Http, public storage: Storage,
              public authHttp: AuthHttp) { }

  login(username: string, password: string): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let searchParams = new URLSearchParams();
    searchParams.append('username', username);
    searchParams.append('password', password);

    return this.http.post(SERVER_URL + '/tokens', searchParams.toString(), { headers: headers })
      .flatMap((response: Response) => {
        return Observable.fromPromise(this.storage.set('auth-token', response.json().token));
      })
      .catch((response: Response) => {
        if (response.status == 401)
          return Observable.throw("Usuario o contraseña incorrectos.");
        else
          return Observable.throw(`Error desconocido: ${response.statusText} (${response.status})`);
      });
  }

  isLogged(): Observable<boolean> {
    return Observable.fromPromise(this.storage.get('auth-token'))
      .flatMap((token) => {
        if (!token) return Observable.of(false);
        return this.getLoggedUserHttp()
          .map((user) => true);
      })
      .catch((error) => {
        return Observable.of(false);
      });
  }

  getLoggedUser(): Observable<IUsuario> {
    if(this.loggedUser)
      return Observable.of(this.loggedUser);

    return this.getLoggedUserHttp()
      .catch((response: Response) => {
        return Observable.throw("Error obteniendo los datos del usuario.");
      });
  }

  setLoggedUser(user: IUsuario) {
    this.loggedUser = user;
  }

  private getLoggedUserHttp() {
    return this.authHttp.get(SERVER_URL + '/usuarios/profile')
        .map((response: Response) => {
          this.loggedUser = response.json().data;
          return this.loggedUser;
        });
  }
}
