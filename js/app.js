// Variables - Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();

function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

// Clase Presupuesto > Constructor / Array actualizado / Restante actualizado / Eliminar Gasto
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
        console.log(gastado);
    }

    eliminarGasto(id){ // Dentro de UI!
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
        console.log(gastos)
    }
}

// Clase UI > insertar / mensajes / Mostrar / Limpiar / actializar / comprobar
class UI {
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto; // Forma directa
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 2345);
    }

    mostrarGastos(gastos){

        this.limpiarHTML();

        gastos.forEach(gasto => {

            const {cantidad, nombre, id} = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            // nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;

            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            // btnBorrar.onclick = eliminarGasto(id);

            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){

        const {presupuesto, restante } = presupuestObj;
        const restanteDiv = document.querySelector('.restante');
        
        if( ( presupuesto / 4 ) >  restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        
        }else if (( presupuesto / 2 ) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto es insuficiente!', 'error');
            formulario.querySelector('button[type="submit"]').disable = true;
        }
    }
}

const ui = new UI() // Instancia de UI

let presupuesto; // Instancia de Presupuesto

// función [Ingresar presupuesto] > preguntar / validar / derivar el valor
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?'); // Te pregunta
    // console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){ // isNAN verifica el texto
        window.location.reload(); // Te vuelve a preguntar, cargando nuevamente
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    // console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);
}

// función [Agregar Gasto] > Validar / Nuevo obj / actualizar
function agregarGasto(e){

    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === ''|| cantidad === ''){
        ui.imprimirAlerta('Ambos campos son necesarios!', 'error');
        return;
    }else if ( cantidad <= 0 || isNaN(cantidad) ){
        ui.imprimirAlerta('Cantidad no válida!', 'error');
        return;
    }

    const gasto = {nombre, cantidad, id: Date.now()};// nombre: nombre,  ...

    presupuesto.nuevoGasto(gasto);
    ui.imprimirAlerta('Gasto agregado correctamente', 'correcto');

    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    formulario.reset();

}

// función [Eliminar Gasto] > Eliminar codigo / Mostrar cambios
function eliminarGasto(id) {

    presupuesto.eliminarGasto(id);

    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}
