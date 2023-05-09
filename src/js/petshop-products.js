const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
const ordenAsc = '&orden=asc';
const ordenDesc = '&orden=desc';
const tipoMedicamento = '?tipo=medicamento';
const tipoJuguete = '?tipo=juguete';
const querys = '';

let ApiMedicamentos = new Array();
let ApiJuguetes = new Array();

// QUERY API STARTED
async function ApiFetch(url, tipo, orden, querys) {
    let response = await fetch(`${url}${tipo}${orden}${querys}`);
    response = await response.json();
    return response;
}

async function getApi() {
    try {
        ApiMedicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '');
        ApiJuguetes = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '');
        getProductsMedicamentos(ApiMedicamentos.products);
        getProductsJuguetes(ApiJuguetes.products);
    } catch (error) {
        console.error(error);
    }
}
// TEMPLATE STARTED
getApi();

const cardsContainerMedicamentos = document.getElementById("cards-container-medicamentos");
const cardsContainerJuguetes = document.getElementById("cards-container-juguetes");

// TEMPLATE FARMACIA
function getProductsMedicamentos(Medicamentos) {
    Medicamentos.forEach((medicamento) => {
        let card = document.createElement("div");
        card.className = "col-md-3 mb-4";
        card.innerHTML = `
    <div class="card rounded shadow h-100">
    <img src="${medicamento.imagen}" onclick="detalleProducto('${medicamento._id}')" class="card-img-top" alt="${medicamento.nombre}">
    <div class="card-body color_primary text-light mb-3">
        <div class="row">
            <span class="card-subtitle font-weight-bold mb-3"><b> ${medicamento.nombre}</b></span>
        </div>
        <div class="row mb-3">
            <p class="card-text mb-1">${medicamento.descripcion}</p>
        </div>
    </div>
    <div class="p-3">
        <p class="success"><i class="fas fa-tags"></i> ${medicamento.tipo}</p>
        <p class="success"><i class="bi bi-bag-check-fill"></i> Stock Disponible</p>
        ${medicamento.stock < 5 ? (
                `<p class="sucess_dark"><i class="bi bi-box-seam-fill"></i><b> Últimas unidades! (${medicamento.stock})</b></p>`
            ) : (
                `<p class="success"><i class="bi bi-box-seam-fill"></i><b> ${medicamento.stock}</b></p>`
            )}
        <p class="success"><i class="bi bi-currency-dollar"></i><b>${medicamento.precio}</b></p>
        <a class="btn btn-outline form-control mt-3" onclick="agregarAlCarrito('${medicamento._id}')"><i class="fas fa-shopping-cart"></i> Add to
            Cart</a>
      </div>
    </div>
    `;
        cardsContainerMedicamentos.appendChild(card);
    });
}
// TEMPLATE JUGUETES
function getProductsJuguetes(Juguetes) {
    Juguetes.forEach((Juguete) => {
        const card = document.createElement("div");
        card.className = "col-md-3 mb-4";
        card.innerHTML = `
    <div class="card rounded shadow h-100">
    <img src="${Juguete.imagen}" onclick="detalleProducto('${Juguete._id}')" class="card-img-top" alt="${Juguete.nombre}">
    <div class="card-body color_primary text-light mb-3">
        <div class="row">
            <span class="card-subtitle font-weight-bold mb-3"><b> ${Juguete.nombre}</b></span>
        </div>
        <div class="row mb-3">
            <p class="card-text mb-1">${Juguete.descripcion}</p>
        </div>
    </div>
    <div class="p-3">
        <p class="success"><i class="fas fa-tags"></i> ${Juguete.tipo}</p>
        <p class="success"><i class="bi bi-bag-check-fill"></i> Stock Disponible</p>
        ${Juguete.stock < 5 ? (
                `<p class="sucess_dark"><i class="bi bi-box-seam-fill"></i><b> Últimas unidades! (${Juguete.stock})</b></p>`
            ) : (
                `<p class="success"><i class="bi bi-box-seam-fill"></i><b> ${Juguete.stock}</b></p>`
            )}
        <p class="success"><i class="bi bi-currency-dollar"></i><b>${Juguete.precio}</b></p>
        <a  class="btn btn-outline form-control mt-3" onclick="agregarAlCarrito('${Juguete._id}')"><i class="fas fa-shopping-cart"></i> Add to
            Cart</a>
      </div>
    </div>
    `;
        cardsContainerJuguetes.appendChild(card);
    });
}


let carrito = new Array();
const numItemsCarritox1 = document.querySelector('#numItemsCarritox1');
const numItemsCarritox2 = document.querySelector('#numItemsCarritox2');
const numItemsCarritox3 = document.querySelector('#numItemsCarritox3');
const numItemsCarritox4 = document.querySelector('#numItemsCarritox4');
const vaciarCarrito = document.querySelector('#vaciarCarrito');
const precioTotal = document.querySelector("#precioTotal");
const procesarCompra = document.querySelector("#procesarCompra");
const activarFuncion = document.querySelector("#activarFuncion");


document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito'));
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
        let apiAux = await ApiFetch(urlApi, '', '', '');
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
        modalBody.innerHTML += `<div class="modal-contenedor d-flex justify-content-center">
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
    numItemsCarritox3.textContent = carrito.length;
    numItemsCarritox4.textContent = carrito.length;

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

function procesarPedido() {
    carrito.forEach((prod) => {
        const listaCompra = document.querySelector("#lista-compra tbody");

        const row = document.createElement('row');
        row.innerHTML += `
        <td>
        <img class="img-fluid img-carrito" src="${img}"/>
        </td>
        <td>${prod.nombre}</td>
      <td>${prod.precio}</td>
      <td>${prod.cantidad}</td>
      <td>${prod.precio * cantidad}</td>

        `

        listaCompra.appendChild(row);
    })
}


function resetearTemplateMedicamentos() {
    cardsContainerMedicamentos.innerHTML = '';
}

function resetearTemplateJuguetes() {
    cardsContainerJuguetes.innerHTML = '';
}

// FILTROS FARMACIA

async function filtrar_medicamentos() {

    let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
    let BusquedaMedicamento = InputSearchMedicamento.value.toLowerCase();
    let apiAux = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '');

    let MedicamentosFiltrados = apiAux?.products.filter(medicamento => {
        medicamento.nombre = medicamento.nombre.toLowerCase();
        medicamento.descripcion = medicamento.descripcion.toLowerCase();
        return medicamento.nombre.indexOf(BusquedaMedicamento) > -1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1;
    })

    let MedicamentosFarmacia = MedicamentosFiltrados.map(medicamento => {
        medicamento.nombre = medicamento.nombre.charAt(0).toUpperCase() + medicamento.nombre.slice(1)
        medicamento.descripcion = medicamento.descripcion.charAt(0).toUpperCase() + medicamento.descripcion.slice(1)
        return { ...medicamento }
    })

    MedicamentosFarmacia.length === 0 ? (
        resetearTemplateMedicamentos(),
        busquedaMedicamentoNoEncontrada()
    ) : (
        resetearTemplateMedicamentos(),
        getProductsMedicamentos(MedicamentosFarmacia)
    )
}

async function filtrarPrecios() {

    let minimo = Number(document.querySelector('#precioMinimo').value);
    let maximo = Number(document.querySelector('#precioMaximo').value);
    let ordenarAsc = document.querySelector('#asc_med')
    let ordenDesc = document.querySelector('#desc_med')

    !minimo ? (
        Swal.fire({
            icon: 'info',
            title: '¡Debes ingresar un precio mínimo!',
            text: 'Para filtrar por precio ambos campos deben contener valores mayor a 0.'
        })
    ) : !maximo ? (
        Swal.fire({
            icon: 'info',
            title: '¡Debes ingresar un precio máximo!',
            text: 'Para filtrar por precio ambos campos deben contener valores mayor a 0.'
        })
    ) : (
        minimo, maximo
    )

    if (minimo && maximo) {

        let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
        let BusquedaMedicamento = InputSearchMedicamento.value.toLowerCase();
        let apiAux = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')

        let MedicamentosFiltrados = apiAux.products.filter(medicamento => {
            medicamento.nombre = medicamento.nombre.toLowerCase();
            medicamento.descripcion = medicamento.descripcion.toLowerCase();
            return (medicamento.nombre.indexOf(BusquedaMedicamento) > -1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
        })

        let MedicamentosFarmacia = MedicamentosFiltrados.map(medicamento => {
            medicamento.nombre = medicamento.nombre.charAt(0).toUpperCase() + medicamento.nombre.slice(1)
            medicamento.descripcion = medicamento.descripcion.charAt(0).toUpperCase() + medicamento.descripcion.slice(1)
            return { ...medicamento }
        })

        MedicamentosFarmacia.length === 0 ? (
            resetearTemplateMedicamentos(),
            busquedaMedicamentoNoEncontrada()
        ) : (
            ordenarAsc.checked = false,
            ordenDesc.checked = false,
            resetearTemplateMedicamentos(),
            getProductsMedicamentos(MedicamentosFarmacia)
        )
    }
}

async function filtrarOrdenarMedicamentos() {

    let minimo = Number(document.querySelector('#precioMinimo').value);
    let maximo = Number(document.querySelector('#precioMaximo').value);
    let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
    let BusquedaMedicamento = InputSearchMedicamento.value.toLowerCase();
    let checkedOrdenMedicamento = document.querySelector('#asc_med');
    let apiAux;

    checkedOrdenMedicamento.checked === true ? (
        apiAux = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')
    ) : (
        apiAux = await ApiFetch(urlApi, tipoMedicamento, ordenDesc, '')
    )

    if (minimo && maximo) {

        let MedicamentosFiltrados = apiAux.products.filter(medicamento => {
            medicamento.nombre = medicamento.nombre.toLowerCase();
            medicamento.descripcion = medicamento.descripcion.toLowerCase();
            return (medicamento.nombre.indexOf(BusquedaMedicamento) > -1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
        })

        let MedicamentosFarmacia = MedicamentosFiltrados.map(medicamento => {
            medicamento.nombre = medicamento.nombre.charAt(0).toUpperCase() + medicamento.nombre.slice(1)
            medicamento.descripcion = medicamento.descripcion.charAt(0).toUpperCase() + medicamento.descripcion.slice(1)
            return { ...medicamento }
        })

        MedicamentosFarmacia.length === 0 ? (
            resetearTemplateMedicamentos(),
            busquedaMedicamentoNoEncontrada()
        ) : (
            resetearTemplateMedicamentos(),
            getProductsMedicamentos(MedicamentosFarmacia)
        )

    } else {

        let MedicamentosFiltrados = apiAux.products.filter(medicamento => {
            medicamento.nombre = medicamento.nombre.toLowerCase();
            medicamento.descripcion = medicamento.descripcion.toLowerCase();
            return (medicamento.nombre.indexOf(BusquedaMedicamento) > -1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1)
        })

        let MedicamentosFarmacia = MedicamentosFiltrados.map(medicamento => {
            medicamento.nombre = medicamento.nombre.charAt(0).toUpperCase() + medicamento.nombre.slice(1)
            medicamento.descripcion = medicamento.descripcion.charAt(0).toUpperCase() + medicamento.descripcion.slice(1)
            return { ...medicamento }
        })

        MedicamentosFarmacia.length === 0 ? (
            resetearTemplateMedicamentos(),
            busquedaMedicamentoNoEncontrada()
        ) : (
            resetearTemplateMedicamentos(),
            getProductsMedicamentos(MedicamentosFarmacia)
        )
    }
}

function busquedaMedicamentoNoEncontrada() {
    cardsContainerMedicamentos.innerHTML = ''
    cardsContainerMedicamentos.innerHTML = `<div class="d-flex shadow align-items-center justify-content-center ">
  <div class="text-center mb-3">
      <h5 class="display-1 text-danger">Productos no encontrados</h5>
      <p class="fs-3 text-dark"> <span class="text-danger">¡</span> La busqueda no funcionó <span class="text-danger">!</span></p>
      <p class="lead text-dark">
          No se encontraron medicamentos registrados en la aplicación por este criterio.
        </p>
      <a href="./petshop-new-products.html" class="btn btn-success bg-2">Registrar Nuevo Producto</a>
  </div>
</div>
  `
}

// FILTROS JUGUETES

function busquedaJugueteNoEncontrada() {
    cardsContainerJuguetes.innerHTML = ''
    cardsContainerJuguetes.innerHTML = `<div class="d-flex shadow align-items-center justify-content-center ">
  <div class="text-center mb-3">
      <h5 class="display-1 text-danger">Productos no encontrados</h5>
      <p class="fs-3 text-dark"> <span class="text-danger">¡</span> La busqueda no funcionó <span class="text-danger">!</span></p>
      <p class="lead text-dark">
          No se encontraron medicamentos registrados en la aplicación por este criterio.
        </p>
      <a href="./petshop-new-products.html" class="btn btn-success bg-2">Registrar Nuevo Producto</a>
  </div>
</div>
  `
}

async function filtrar_juguetes() {

    let InputSearchJuguete = document.querySelector('#BuscarJuguetes');
    let BusquedaJuguete = InputSearchJuguete.value.toLowerCase();
    let apiAux = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '');

    let JuguetesFiltrados = apiAux?.products.filter(juguete => {
        juguete.nombre = juguete.nombre.toLowerCase();
        juguete.descripcion = juguete.descripcion.toLowerCase();
        return juguete.nombre.indexOf(BusquedaJuguete) > -1 || juguete.descripcion.indexOf(BusquedaJuguete) > -1;
    })

    let TiendaJuguetes = JuguetesFiltrados.map(juguete => {
        juguete.nombre = juguete.nombre.charAt(0).toUpperCase() + juguete.nombre.slice(1)
        juguete.descripcion = juguete.descripcion.charAt(0).toUpperCase() + juguete.descripcion.slice(1)
        return { ...juguete }
    })

    TiendaJuguetes.length === 0 ? (
        resetearTemplateJuguetes(),
        busquedaJugueteNoEncontrada()
    ) : (
        resetearTemplateJuguetes(),
        getProductsJuguetes(TiendaJuguetes)
    )
}

async function filtrarPreciosJuguete() {

    let minimo = Number(document.querySelector('#precioMinimoJuguete').value);
    let maximo = Number(document.querySelector('#precioMaximoJuguete').value);
    let ordenarAsc = document.querySelector('#asc_jug')
    let ordenDesc = document.querySelector('#desc_jug')

    !minimo ? (
        Swal.fire({
            icon: 'info',
            title: '¡Debes ingresar un precio mínimo!',
            text: 'Para filtrar por precio ambos campos deben contener valores mayor a 0.'
        })
    ) : !maximo ? (
        Swal.fire({
            icon: 'info',
            title: '¡Debes ingresar un precio máximo!',
            text: 'Para filtrar por precio ambos campos deben contener valores mayor a 0.'
        })
    ) : (
        minimo, maximo
    )

    if (minimo && maximo) {
        let InputSearchJuguete = document.querySelector('#BuscarJuguetes');
        let BusquedaJuguete = InputSearchJuguete.value.toLowerCase();
        let apiAux = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')

        let JuguetesFiltrados = apiAux?.products.filter(juguete => {
            juguete.nombre = juguete.nombre.toLowerCase();
            juguete.descripcion = juguete.descripcion.toLowerCase();
            return (juguete.nombre.indexOf(BusquedaJuguete) > -1 || juguete.descripcion.indexOf(BusquedaJuguete) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
        })

        let TiendaJuguetes = JuguetesFiltrados.map(juguete => {
            juguete.nombre = juguete.nombre.charAt(0).toUpperCase() + juguete.nombre.slice(1)
            juguete.descripcion = juguete.descripcion.charAt(0).toUpperCase() + juguete.descripcion.slice(1)
            return { ...juguete }
        })

        TiendaJuguetes.length === 0 ? (
            resetearTemplateJuguetes(),
            busquedaJugueteNoEncontrada()
        ) : (
            ordenarAsc.checked = false,
            ordenDesc.checked = false,
            resetearTemplateJuguetes(),
            getProductsJuguetes(TiendaJuguetes)
        )
    }
}

async function filtrarOrdenarJuguetes() {

    let minimo = Number(document.querySelector('#precioMinimoJuguete').value);
    let maximo = Number(document.querySelector('#precioMaximoJuguete').value);
    let InputSearchJuguetes = document.querySelector('#BuscarJuguetes');
    let BusquedaJuguete = InputSearchJuguetes.value.toLowerCase();
    let checkedOrdenJuguetes = document.querySelector('#asc_jug');
    let apiAux;

    checkedOrdenJuguetes.checked === true ? (
        apiAux = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')
    ) : (
        apiAux = await ApiFetch(urlApi, tipoJuguete, ordenDesc, '')
    )

    if (minimo && maximo) {

        let JuguetesFiltrados = apiAux.products.filter(juguete => {
            juguete.nombre = juguete.nombre.toLowerCase();
            juguete.descripcion = juguete.descripcion.toLowerCase();
            return (juguete.nombre.indexOf(BusquedaJuguete) > -1 || juguete.descripcion.indexOf(BusquedaJuguete) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
        })

        let TiendaJuguetes = JuguetesFiltrados.map(juguete => {
            juguete.nombre = juguete.nombre.charAt(0).toUpperCase() + juguete.nombre.slice(1)
            juguete.descripcion = juguete.descripcion.charAt(0).toUpperCase() + juguete.descripcion.slice(1)
            return { ...juguete }
        })

        TiendaJuguetes.length === 0 ? (
            resetearTemplateJuguetes(),
            busquedaJugueteNoEncontrada()
        ) : (
            resetearTemplateJuguetes(),
            getProductsJuguetes(TiendaJuguetes)
        )

    } else {

        let JuguetesFiltrados = apiAux.products.filter(juguete => {
            juguete.nombre = juguete.nombre.toLowerCase();
            juguete.descripcion = juguete.descripcion.toLowerCase();
            return (juguete.nombre.indexOf(BusquedaJuguete) > -1 || juguete.descripcion.indexOf(BusquedaJuguete) > -1);
        })

        let TiendaJuguetes = JuguetesFiltrados.map(juguete => {
            juguete.nombre = juguete.nombre.charAt(0).toUpperCase() + juguete.nombre.slice(1)
            juguete.descripcion = juguete.descripcion.charAt(0).toUpperCase() + juguete.descripcion.slice(1)
            return { ...juguete }
        })

        TiendaJuguetes.length === 0 ? (
            resetearTemplateJuguetes(),
            busquedaJugueteNoEncontrada()
        ) : (
            resetearTemplateJuguetes(),
            getProductsJuguetes(TiendaJuguetes)
        )

    }
}

// REFRESCAR TEMPLATE
async function limpiarTemplateMedicamento() {
    let precioMinimo = document.querySelector('#precioMinimo')
    let precioMaximo = document.querySelector('#precioMaximo')
    let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
    let ordenarAsc = document.querySelector('#asc_med')
    let ordenDesc = document.querySelector('#desc_med')

    precioMinimo.value = 0;
    precioMaximo.value = 0;
    ordenarAsc.checked = false;
    ordenDesc.checked = false;
    InputSearchMedicamento.value = '';

    let apiMedicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')

    resetearTemplateMedicamentos();
    getProductsMedicamentos(apiMedicamentos?.products)
}

async function limpiarTemplateJuguetes() {
    let precioMinimo = document.querySelector('#precioMinimoJuguete')
    let precioMaximo = document.querySelector('#precioMaximoJuguete')
    let InputSearchJuguetes = document.querySelector('#BuscarJuguetes');
    let ordenarAsc = document.querySelector('#asc_jug')
    let ordenDesc = document.querySelector('#desc_jug')

    precioMinimo.value = 0;
    precioMaximo.value = 0;
    ordenarAsc.checked = false;
    ordenDesc.checked = false;
    InputSearchJuguetes.value = '';

    let ApiJuguetes = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')

    resetearTemplateJuguetes();
    getProductsJuguetes(ApiJuguetes?.products)
}


// Detalle producto

function detalleProducto(id) {
    console.log('id a buscar:', id);
    window.location.href = `petshop-details.html?id=${id}`;
    procesarPedido();
}

function mostrarDetalleVenta() {
    const tablaVenta = document.getElementById("lista-compra");
    const tbody = tablaVenta.querySelector("tbody");
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


procesarCompra.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "¡Debes agregar productos para procesar la compra!",
            icon: "warning",
            confirmButtonText: "Aceptar",
        });
    } else {
        location.href = "petshop-purchase.html";
    }
});

function finalizarCompra() {
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
            mostrarCarrito();
            Swal.fire(
                '¡Compra exitosa!',
                'Gracias por tu compra.',
                'success'
            )

        }

       location.href = 'petshop-products.html';

    });
}