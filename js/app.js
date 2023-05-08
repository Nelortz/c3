/*Establecer conexion con la Api*/
const url = 'http://localhost:3000/api-c3/usuario/';

//definir variables 
const contenedor = document.querySelector('tbody');

//variable para almacenar los datos desde la BD 

let resultado = '';
//activar el modal

const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'));

//acceso al formulario

const formUsuario = document.querySelector('form');

//definir variables del formulario

const nombre = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const email = document.getElementById('email');
const password = document.getElementById('password');
//opcion oara controlar el proceso de CREAR 
let opcion = '';
//activar boton desde js

btnCrear.addEventListener('click', () => {
    modalUsuario.show();
    nombre.value = '';
    apellido.value = '';
    email.value = '';
    password.value = '';
    opcion = 'crear';

});

//funcion para mostrar los resultados
const mostrar = (usuarios) => {
    usuarios.forEach(usuario => {
        resultado += `<tr>
                    <td>${usuario.id_usuario}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellido}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.password}</td>
                    <td class="text-center">
                    <a class="btnEditar btn btn-dark text-warning">Editar</a>
                    <a class="btnBorrar btn btn-dark">Borrar</a>
                    </td>
                    `
    });
    contenedor.innerHTML = resultado;
}
//mostrar registros
fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error))

//Activar los botones
const on = (element, event, selector, handler) => {
    //console.log(element);
    //console.log(event);
    //console.log(selector);
    //console.log(handler);
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

//Pasar la variable al boton de eliminar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("Desea eliminar el registro?",
        function () {
            //Enviar los datos a la api para eliminacion
            fetch(url + id, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(() => location.reload())
            alertify.success('Registro Eliminado');
        },
        function () {
            alertify.error('Cancelado');
        });
})

//Procedimiento para editar 
let idForm = 0
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const apellidoForm = fila.children[2].innerHTML
    const emailForm = fila.children[3].innerHTML
    const passwordForm = fila.children[4].innerHTML
    nombre.value = nombreForm
    apellido.value = apellidoForm
    email.value = emailForm
    password.value = passwordForm
    opcion = 'editar'
    modalUsuario.show()
})

//Procedimiento para Crear y Editar 
formUsuario.addEventListener('submit', (e) => {
    e.preventDefault()
    if (opcion == 'crear') {
        //console.log('OPCION CREAR')
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre.value,
                apellido: apellido.value,
                email: email.value,
                password: password.value
            })
        })
            .then(response => response.json())
            .then(data => {
                const nuevoUsuario = []
                nuevoUsuario.push(data)
                mostrar(nuevoUsuario)
            })
        .then( ()=> location.reload())
    }
    if (opcion == 'editar') {
        //console.log('OPCION EDITAR')
        fetch(url + idForm, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre.value,
                apellido: apellido.value,
                email: email.value,
                password: password.value
            })
        })
            .then(response => response.json())
            .then(response => location.reload())
    }
    modalUsuario.hide()

    
})