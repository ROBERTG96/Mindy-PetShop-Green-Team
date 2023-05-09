const urlApiShopping = "https://pro-talento.up.railway.app/api/mindy/products";

async function ApiFetch() {
    let response = await fetch(urlApiShopping);
    response = await response.json();
    return response;
}


// carrito 
let carrito = new Array();
const numItemsCarritox1 = document.querySelector('#numItemsCarritox1');
const numItemsCarritox2 = document.querySelector('#numItemsCarritox2');

const vaciarCarrito = document.querySelector('#vaciarCarrito');
const precioTotal = document.querySelector("#precioTotal");

document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    mostrarCarrito();
})

vaciarCarrito.addEventListener('click', () => {
    // Mostrar una alerta de SweetAlert
    Swal.fire({
        title: '¿Está seguro?',
        text: '¿Está seguro de que quiere vaciar el carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, ¡estoy seguro!',
        dangerMode: true,
    }).then((vaciar) => {
        // Si el usuario confirma la acción, vaciar el carrito
        if (vaciar.isConfirmed) {
            carrito = [];
            mostrarCarrito();
            Swal.fire(
                'Carrito vaciado!',
                'Los elementos han sido eliminados.',
                'success'
            )
        }
    });
});


async function agregarAlCarrito(idProducto) {
    const existeProductoEnCarrito = carrito.some(prod => prod._id === idProducto)
    if (existeProductoEnCarrito) {
        const productoExistente = carrito.find(prod => prod._id === idProducto);
        productoExistente.cantidad++;
    } else {
        let apiAux = await ApiFetch(urlApiShopping);
        const item = apiAux.products.find((prod) => prod._id === idProducto);
        item.cantidad = 1;
        carrito.push(item);
    }
    mostrarCarrito();
}
// RESETEAR TEMPLATE

function resetearTemplateMedicamentos() {
    cardsContainerMedicamentos.innerHTML = '';
}


const mostrarCarrito = () => {
    const modalBody = document.querySelector('.modal .modal-body');
    modalBody.innerHTML = '';

    carrito.forEach((producto) => {
        modalBody.innerHTML += `<div class="modal-contenedor">
        <hr>
        <div>
            <img src="${producto.imagen}" class="img-fluid img-carrito img" alt="${producto.nombre}">
        </div>
    
        <div>
            <p>Producto: ${producto.nombre}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
    
            <button onclick="eliminarProducto('${producto._id}')" class="btn btn-danger mb-4">Eliminar del carrito</button>
        </div>
        
    </div>`
    });

    if (carrito.length == 0) {
        modalBody.innerHTML = `<div class="alert alert-warning" role="alert">
        ¡Tu carrito está vacío! Debes agregar productos, para procesar tu compra.
      </div>`
    }

    precioTotal.textContent = carrito.reduce((acc, prod) => acc + parseFloat(prod.cantidad) * parseFloat(prod.precio), 0)

    numItemsCarritox1.textContent = carrito.length;
    numItemsCarritox2.textContent = carrito.length;

    guardarStorage();
}


function eliminarProducto(id) {
    const productId = id;
    carrito = carrito.filter((product) => product._id !== productId);
    mostrarCarrito();
}

function guardarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarDetalleVenta() {
    const tablaVenta = document.getElementById("lista-compra");
    const tbody = tablaVenta.querySelector("#cuerpoTabla");
    const filasAnteriores = tbody.querySelectorAll("tr");
    filasAnteriores.forEach((fila) => fila.remove());

    let total = 0;

    carrito.forEach((producto) => {
        const fila = document.createElement("tr");
        const imagenCelda = document.createElement("td");
        const imagen = document.createElement("img");
        imagen.src = producto.imagen;
        imagenCelda.appendChild(imagen);
        fila.appendChild(imagenCelda);
        const nombreCelda = document.createElement("td");
        nombreCelda.textContent = producto.nombre;
        fila.appendChild(nombreCelda);
        const precioCelda = document.createElement("td");
        precioCelda.textContent = producto.precio;
        fila.appendChild(precioCelda);
        const cantidadCelda = document.createElement("td");
        cantidadCelda.textContent = producto.cantidad;
        fila.appendChild(cantidadCelda);
        const subtotalCelda = document.createElement("td");
        subtotalCelda.textContent = cantidadCelda.textContent * precioCelda.textContent;
        fila.appendChild(subtotalCelda);
        total += producto.subtotal;
        tbody.appendChild(fila);
    });
    console.log(carrito);
    let ventaCarrito = carrito.map(venta => {
        return venta.cantidad * venta.precio;
    }).reduce((acc, val) => {
        return acc + val;
    })


    console.log(ventaCarrito);

    document.getElementById("totalProceso").textContent = ventaCarrito;
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarDetalleVenta();
});

function finalizarCompra() {
    const tbody = document.getElementById("cuerpoTabla");
    console.log(tbody);
    // Mostrar una alerta de SweetAlert
    Swal.fire({
        title: '¿Está seguro de tu compra?',
        text: '¿Está seguro de que quiere finalizar tu compra?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, ¡estoy seguro!',
        dangerMode: true,
    }).then((vaciar) => {
        // Si el usuario confirma la acción, vaciar el carrito
        if (vaciar.isConfirmed) {
            carrito = [];
            tbody.innerHTML = '';
            localStorage.setItem('carrito', JSON.stringify(carrito));
            /* mostrarCarrito(); */
            Swal.fire({
                title: '¡Compra exitosa!',
                text: 'Gracias por tu compra.',
                icon: 'success',
                timer: 3000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
            }).then(() => {
                location.href = 'petshop-products.html';
            });
        }
    });
}

mostrarDetalleVenta();