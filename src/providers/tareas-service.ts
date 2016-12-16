import { AuthHttp } from 'angular2-jwt';
import { SERVER_URL } from '../app/app.constants';
import { ITarea, Tarea, TareaEstado } from '../model/tarea';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class TareasService {

  constructor(public http: AuthHttp) { }

  getTareas(): Observable<Tarea[]> {
    return this.http.get(SERVER_URL + '/tareas')
      .map((response: Response) => {
        let tareas: ITarea[] = response.json().data;
        return tareas.map(t => new Tarea(t));
      })
      .catch((response: Response) => {
        console.error(response);
        return Observable.throw("Error obteniendo tareas");
      });
  }

  creaTarea(tarea: ITarea): Observable<Tarea> {
    return this.http.post(SERVER_URL + '/tareas', tarea)
      .map((response: Response) => {
        return new Tarea(response.json().data);
      })
      .catch((response: Response) => {
        return Observable.throw("Error creando la tarea");
      });;
  }

  borraTarea(idTarea: number): Observable<boolean> {
    return this.http.delete(SERVER_URL + '/tareas/' + idTarea)
      .map((response: Response) => {
        return true;
      })
      .catch((response: Response) => {
        return Observable.throw("Error borrando la tarea");
      });
  }

  cambiaEstadoTarea(tarea: Tarea): Observable<TareaEstado> {
    let nuevoEstado: TareaEstado = tarea.estado == "TERMINADA" ? "PENDIENTE" : "TERMINADA";

    return this.http.put(SERVER_URL + '/tareas/' + tarea.id, {
        estado: nuevoEstado
      })
      .map((response: Response) => {
        return nuevoEstado;
      })
      .catch((response: Response) => {
        return Observable.throw("Error cambiando el estado");
      });
  }
}
