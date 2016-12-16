import { NuevaTareaPage } from '../nueva-tarea/nueva-tarea';
import { AuthService } from '../../providers/auth-service';
import { TareasService } from '../../providers/tareas-service';
import { Tarea } from '../../model/tarea';
import { Component } from '@angular/core';
import { AlertController, Events, ItemSliding, NavController, ToastController } from 'ionic-angular';

/*
  Generated class for the Tareas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tareas',
  templateUrl: 'tareas.html'
})
export class TareasPage {
  tareasPendientes: Tarea[] = [];
  tareasTerminadas: Tarea[] = [];
  estadoTareas: string = "pendientes";

  constructor(private navCtrl: NavController,
    private tasksService: TareasService,
    private authService: AuthService,
    private alerCtrl: AlertController,
    private events: Events,
    private toast: ToastController) { }

  ionViewDidLoad() {
    this.tasksService.getTareas().subscribe(
      (tareas) => {
        this.tareasPendientes = tareas.filter(t => t.estado === "PENDIENTE");
        this.tareasTerminadas = tareas.filter(t => t.estado === "TERMINADA");
      },
      (error) => this.showToast(3000, error)
    );

    this.authService.getLoggedUser()
      .subscribe(
      (user) => this.events.publish('user:logged', user),
      (error) => console.error(error)
      );

    this.events.subscribe('task:created', (taskData) => {
      let tarea = <Tarea>taskData[0];
      this.tareasPendientes.unshift(tarea);
      this.estadoTareas = "pendientes";
    });
  }

  crearTarea() {
    this.navCtrl.push(NuevaTareaPage);
  }

  getListaTareasActual() {
    return this.estadoTareas == 'pendientes' ?
      this.tareasPendientes : this.tareasTerminadas;
  }

  getListaTareasDestino() {
    return this.estadoTareas == 'terminadas' ?
      this.tareasPendientes : this.tareasTerminadas;
  }

  getTareaColor(tarea: Tarea) {
    return `pri${tarea.getPrioridadString()}`;
  }

  cambiarEstadoTarea(slidingItem: ItemSliding, tarea: Tarea) {
    slidingItem.close();
    this.tasksService.cambiaEstadoTarea(tarea)
      .subscribe(
        (estado) => {
          tarea.estado = estado;
          this.moverTareaLista(tarea);
          let nombreListaDest = this.estadoTareas == "pendientes" ? "terminadas" : "pendientes";
          this.showToast(3000, `Se ha movido la tarea a la lista de ${nombreListaDest}.`);
        },
        error => this.showToast(3000, error)
      );
  }

  eliminarTarea(slidingItem: ItemSliding, tarea: Tarea) {
    slidingItem.close();
    let lista = this.getListaTareasActual();

    let confirm = this.alerCtrl.create({
      title: "Eliminar tarea",
      message: `¿Realmente quieres borrar esta tarea?: ${tarea.nombre}`,
      buttons: [
        {
          text: "Si",
          handler: () => {
            this.tasksService.borraTarea(tarea.id)
              .subscribe(
                (ok) => {
                  lista.splice(lista.indexOf(tarea), 1);
                  this.showToast(3000, "Tarea eliminada");
                },
                (error) => this.showToast(3000,error)
              );
          }
        }, {
          text: "No",
          role: 'cancel'
        }
      ]
    });
    confirm.present();
  }

  private moverTareaLista(tarea: Tarea) {
    let listaActual = this.getListaTareasActual();
    let listaDestino = this.getListaTareasDestino();
    listaActual.splice(listaActual.indexOf(tarea), 1);
    listaDestino.unshift(tarea);
    listaDestino.sort((t1, t2) => t2.fechaAlta.getTime() - t1.fechaAlta.getTime());
  }

  private showToast(duration: number, message: string) {
    let toast = this.toast.create({
      duration,
      message
    });
    toast.present();
  }
}
