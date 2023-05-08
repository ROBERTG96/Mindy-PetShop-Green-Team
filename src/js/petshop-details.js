const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";

async function ApiFetch() {
    let response = await fetch(urlApi);
    response = await response.json();
    return response;
}

const Card = document.getElementById("details_card");
const CardImg = document.getElementById("image");
const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get('id');

async function DetalleProductoId() {

    let apiProducts = await ApiFetch();

    let ProductoDetalle = apiProducts?.products.filter(producto => {
        return producto._id === id
    })
    console.log(ProductoDetalle);
    let producto = ProductoDetalle[0];
    Card.innerHTML = `
    <div class="card mt-2 ">
    <div class="row g-0 p-4">
      <div class="col-md-6">
        <img 
          src="${producto.imagen}" 
          alt="${producto.nombre}"
          class="img-fluid rounded-start  w-100"
        />
      </div>

      <div class="col-md-6">
      <div class="card-body color_primary">
      <div class="card p-4">  
          <span><b>Nuevo</b></span>
          <a> <i class="bi bi-heart-fill text-warning" style="float:right;font-size:25px"></i></a>
       
          <h4 class="card-title mt-3"> ${producto.nombre}</h4>
          <h5 class="mt-4"> ${producto.descripcion}
          </h5>
    
         
          <h4 class="card-text">
          <h5 class=""><i class="bi bi-tags"></i> ${producto.tipo}</h5>
        </h4>
      
        <h4 class="card-text">
            <h5 class=""><i class="bi bi-box-seam-fill"></i> Stock Disponible</h5>
        </h4>

   
        ${producto.stock < 5 ? (
          `
          <h4 class="card-text">
          <h5 class="sucess_dark"><i class="bi bi-basket2"></i> Últimas unidades! (${producto.stock}) Unidad</h5>
          </h4>`
      ) : (
          `
          <h4 class="card-text">
          <h5 class=""><i class="bi bi-basket2"></i> Cantidad: ${producto.stock} Unidad</h5>
          </h4>
          `
      )}

        <h4 class="card-text">
        <h5 class=""><i class="bi bi-truck"></i> Envíos a nivel nacional</h5>
      </h4>

        <h4 class="card-text">
        <h4 class=""><i class="bi bi-currency-dollar"></i>${producto.precio}</h4>
       </h4>

          
       <a class="btn btn-outline form-control mt-3" onclick="agregarAlCarrito('${producto._id}')"><i class="fas fa-shopping-cart"></i> Add to
       Cart</a>

          </div>
        
        

      </div>
  </div>

    </div>
  </div>
         `
}

DetalleProductoId(); 

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
        let apiAux = await ApiFetch(urlApi);
        const item = apiAux?.products.find((prod) => prod._id === idProducto);
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


