const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
let Api = new Array();
let ApiMedicamentos = new Array();
let ApiJuguetes = new Array();


async function ApiFetch() {
  let response = await fetch(urlApi);
  response = await response.json();
  return response;
}

async function getApi(urlApi) {
  try {
    let response = await fetch(urlApi);
    response = await response.json();
    Api = response.products;
    ApiMedicamentos = response.products.filter(categoria => categoria.tipo === "Medicamento");
    ApiJuguetes = response.products.filter(categoria => categoria.tipo === "Juguete");
    getProductsMedicamentos(ApiMedicamentos);
    getProductsJuguetes(ApiJuguetes);
  } catch (error) {
    console.error(error);
  }
}

getApi(urlApi);

const cardsContainerMedicamentos = document.getElementById("cards-container-medicamentos");
const cardsContainerJuguetes = document.getElementById("cards-container-juguetes");

function getProductsMedicamentos(Medicamentos) {
  Medicamentos.forEach((medicamento) => {
    let card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card rounded shadow h-100">
        <img src="${medicamento.imagen}" class="card-img-top" alt="${medicamento.nombre}">
        <div class="card-body color_primary text-light mb-3">
        <div class="row">  
          <h5 class="card-title mb-3">${medicamento.nombre}</h5>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <p class="card-text"><i class="fas fa-dollar-sign"></i> ${medicamento.precio}</p>
            </div>
            <div class="col-6">
            <p class="card-text"><i class="fas fa-tags"></i> ${medicamento.tipo}</p>
          </div>
          
          </div>
          <p class="card-text mb-1">${medicamento.descripcion}</p>
        </div>
        <div class="input-group p-2 mb-3">
        <button class="btn btn-stock font-weight-bold" type="button" id="button-minus-0">-</button>
        <input type="text" class="form-control" placeholder="Cantidad" aria-label="Cantidad" value="0" id="quantity-0">
        <button class="btn btn-stock font-weight-bold" type="button" id="button-plus-0">+</button>
        <span class="input-group-text">Existencias: <span id="stock-0">${medicamento.stock}</span></span>
       </div>

        <div class="d-flex justify-content-center mb-1">
            <button type="button" class="btn btn-block btn-light" onclick="agregarAlCarrito(${JSON.stringify(medicamento)})">
              <i class="fas fa-shopping-cart btn-icon"></i> Agregar al carrito
            </button>
          </div>
      </div>
    `;
    cardsContainerMedicamentos.appendChild(card);
  });
}

function getProductsJuguetes(Juguetes) {
  Juguetes.forEach((Juguete) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card rounded shadow h-100">
        <img src="${Juguete.imagen}" class="card-img-top" alt="${Juguete.nombre}">
        <div class="card-body color_primary text-light mb-3">
        <div class="row">  
          <h5 class="card-title mb-3">${Juguete.nombre}</h5>
          </div>
          <div class="row mb-3">
            <div class="col-6">
              <p class="card-text"><i class="fas fa-dollar-sign"></i> ${Juguete.precio}</p>
            </div>
            <div class="col-6">
            <p class="card-text"><i class="fas fa-tags"></i> ${Juguete.tipo}</p>
          </div>
          
          </div>
          <p class="card-text mb-1">${Juguete.descripcion}</p>
        </div>
        <div class="input-group p-2 mb-3">
        <button class="btn btn-stock font-weight-bold" type="button" id="button-minus-0">-</button>
        <input type="text" class="form-control" placeholder="Cantidad" aria-label="Cantidad" value="0" id="quantity-0">
        <button class="btn btn-stock font-weight-bold" type="button" id="button-plus-0">+</button>
        <span class="input-group-text">Existencias: <span id="stock-0">${Juguete.stock}</span></span>
       </div>

        <div class="d-flex justify-content-center mb-1">
            <button type="button" class="btn btn-block btn-light" onclick="agregarAlCarrito(${JSON.stringify(Juguete)})">
              <i class="fas fa-shopping-cart btn-icon"></i> Agregar al carrito
            </button>
          </div>
      </div>
    `;
    cardsContainerJuguetes.appendChild(card);
  });
}

function resetearTemplateMedicamentos() {
  cardsContainerMedicamentos.innerHTML = '';
}
function resetearTemplateJuguetes() {
  cardsContainerJuguetes.innerHTML = '';
}

async function filtrar_medicamentos() {

  let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
  let BusquedaMedicamento = InputSearchMedicamento.value.toLowerCase();

  let api = await ApiFetch();
  let medicamentos = api.products.filter(categoria => categoria.tipo === "Medicamento");

  let MedicamentosFiltrados = medicamentos.filter(medicamento => {
    medicamento.nombre = medicamento.nombre.toLowerCase();
    medicamento.descripcion = medicamento.descripcion.toLowerCase();

    return medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1;
  })

  console.log('MedicamentosFiltrados:', MedicamentosFiltrados);

  if (MedicamentosFiltrados.length === 0) {
    resetearTemplateMedicamentos();
    busquedaMedicamentoNoEncontrada();
  } else {
    resetearTemplateMedicamentos();
    getProductsMedicamentos(MedicamentosFiltrados)
  }

}

async function filtrarPrecios() {

  let minimo = Number(document.querySelector('#precioMinimo').value);
  let maximo = Number(document.querySelector('#precioMaximo').value);
  let desc = document.querySelector('#desc_med');

  if (!minimo) {
    Swal.fire({
      icon: 'info',
      title: '¡Debes ingresar un precio mínimo!',
      text: 'Para filtrar por precio ambos campos deben contener valores mayor a 0.'
    })
  } else if (!maximo) {
    Swal.fire({
      icon: 'info',
      title: '¡Debes ingresar un precio máximo!',
      text: 'Para filtrar por precio ambos campos deben contener valores mayor a 0.'
    })
  } else if (minimo && maximo) {

    let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
    let BusquedaMedicamento = InputSearchMedicamento.value.toLowerCase();
    let medicamentos;

    if (desc.checked) {
      medicamentos = await fetch(`${urlApi}?tipo=medicamento&orden=desc`);
      medicamentos = await medicamentos.json();

    } else {
      medicamentos = await fetch(`${urlApi}?tipo=medicamento&orden=asc`);
      medicamentos = await medicamentos.json();
    }

    let MedicamentosFiltrados = medicamentos.products?.filter(medicamento => {
      medicamento.nombre = medicamento.nombre.toLowerCase();
      medicamento.descripcion = medicamento.descripcion.toLowerCase();

      return (medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
    })

    if (MedicamentosFiltrados.length === 0) {
      resetearTemplateMedicamentos();
      busquedaMedicamentoNoEncontrada();
    } else {
      resetearTemplateMedicamentos();
      getProductsMedicamentos(MedicamentosFiltrados)
    }
  }
}

async function ordenarPorPrecio(asc, des) {
  let api = await ApiFetch();
  let medicamentos = api.products.filter(categoria => categoria.tipo === "Medicamento");

  console.log('ordenando asc:', asc);
  console.log(medicamentos);
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