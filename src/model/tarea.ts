export type TareaEstado = "PENDIENTE" | "TERMINADA";

export enum TareaPrioridad {
    BAJA = 1,
    MEDIA = 2,
    ALTA = 3
}

export interface ITarea {
    estado?: TareaEstado;
    fechaAlta?: string;
    id?: number;
    nombre: string;
    prioridad: TareaPrioridad;
}

export class Tarea {
    public estado: TareaEstado;
    public id: number;
    public fechaAlta: Date;
    public nombre: string;
    public prioridad: TareaPrioridad;

    constructor(tarea: ITarea) {
        this.estado = tarea.estado || "PENDIENTE";
        this.fechaAlta = tarea.fechaAlta?new Date(tarea.fechaAlta):new Date();
        this.id = tarea.id || -1;
        this.nombre = tarea.nombre;
        this.prioridad = tarea.prioridad;
    }

    public getPrioridadString() {
        switch(this.prioridad) {
            case TareaPrioridad.ALTA: 
                return "Alta";
            case TareaPrioridad.MEDIA: 
                return "Media";
            case TareaPrioridad.BAJA: 
                return "Baja";
            default:
                return "Desconocida";
        }
    }
}