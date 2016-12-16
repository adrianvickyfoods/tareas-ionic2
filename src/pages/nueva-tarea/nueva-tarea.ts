import { TareasService } from '../../providers/tareas-service';
import { ITarea, TareaPrioridad } from '../../model/tarea';
import { Component } from '@angular/core';
import { Events, NavController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-nueva-tarea',
  templateUrl: 'nueva-tarea.html'
})
export class NuevaTareaPage {
  tarea: ITarea = {
      nombre: "",
      prioridad: TareaPrioridad.BAJA
  };

  constructor(public navCtrl: NavController, private toast: ToastController,
              private tareasService: TareasService, private events: Events) {}

  crearTarea() {
    this.tareasService.creaTarea(this.tarea)
      .subscribe(
        (tarea) => {
          this.events.publish('task:created',tarea);
          this.navCtrl.pop();
        },
        (error) => this.mostrarToast(error)
      );
  }

  mostrarToast(mensaje) {
    let toast = this.toast.create({
      message: mensaje,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

}
