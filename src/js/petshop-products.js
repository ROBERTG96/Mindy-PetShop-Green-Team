const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
const ordenAsc = '&orden=asc';
const ordenDesc = '&orden=desc';
const tipoMedicamento = '?tipo=medicamento';
const tipoJuguete = '?tipo=juguete';

let ApiMedicamentos = new Array();
let ApiJuguetes = new Array();


async function ApiFetch(url, tipo, orden) {
  let response = await fetch(`${url}${tipo}${orden}`);
  response = await response.json();
  return response;
}

async function getApi() {
  try {
    ApiMedicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenAsc);
    ApiJuguetes = await ApiFetch(urlApi, tipoJuguete, ordenAsc);
    getProductsMedicamentos(ApiMedicamentos.products);
    getProductsJuguetes(ApiJuguetes.products);
  } catch (error) {
    console.error(error);
  }
}

getApi();

const cardsContainerMedicamentos = document.getElementById("cards-container-medicamentos");
const cardsContainerJuguetes = document.getElementById("cards-container-juguetes");

function getProductsMedicamentos(Medicamentos) {
  Medicamentos.forEach((medicamento) => {
    let card = document.createElement("div");
    card.className = "col-md-3 mb-4";
    card.innerHTML = `
    <div class="card rounded shadow h-100">
    <img src="${medicamento.imagen}" class="card-img-top" alt="${medicamento.nombre}">
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
        <a href="#" class="btn btn-outline form-control mt-3"><i class="fas fa-shopping-cart"></i> Add to
            Cart</a>
      </div>
    </div>
    `;
    cardsContainerMedicamentos.appendChild(card);
  });
}

function getProductsJuguetes(Juguetes) {
  Juguetes.forEach((Juguete) => {
    const card = document.createElement("div");
    card.className = "col-md-3 mb-4";
    card.innerHTML = `
    <div class="card rounded shadow h-100">
    <img src="${Juguete.imagen}" class="card-img-top" alt="${Juguete.nombre}">
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
        <a href="#" class="btn btn-outline form-control mt-3"><i class="fas fa-shopping-cart"></i> Add to
            Cart</a>
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

  let api = await ApiFetch(urlApi, tipoMedicamento, ordenAsc);

  console.log(api);

  let MedicamentosFiltrados = api?.products.filter(medicamento => {
    medicamento.nombre = medicamento.nombre.toLowerCase();
    medicamento.descripcion = medicamento.descripcion.toLowerCase();

    return medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1;
  })

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
    let medicamentos;

    desc.checked ? (
      medicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenDesc)
    ) : (
      medicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenAsc)
    )

    let MedicamentosFiltrados = medicamentos.products.filter(medicamento => {
      medicamento.nombre = medicamento.nombre.toLowerCase();
      medicamento.descripcion = medicamento.descripcion.toLowerCase();

      return (medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
    })

    MedicamentosFiltrados.length === 0 ? (
      resetearTemplateMedicamentos(),
      busquedaMedicamentoNoEncontrada()
    ) : (
      resetearTemplateMedicamentos(),
      getProductsMedicamentos(MedicamentosFiltrados)
    )

  }

}

async function filtrarOrdenar() {

  let minimo = Number(document.querySelector('#precioMinimo').value);
  let maximo = Number(document.querySelector('#precioMaximo').value);
  let asc = document.querySelector('#asc_med');

  if (minimo && maximo) {

    let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
    let BusquedaMedicamento = InputSearchMedicamento.value.toLowerCase();
    let medicamentos;

    asc.checked ? (
      medicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenAsc)
    ) : (
      medicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenDesc)
    )

    let MedicamentosFiltrados = medicamentos.products.filter(medicamento => {
      medicamento.nombre = medicamento.nombre.toLowerCase();
      medicamento.descripcion = medicamento.descripcion.toLowerCase();

      return (medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
    })

    MedicamentosFiltrados.length === 0 ? (
      resetearTemplateMedicamentos(),
      busquedaMedicamentoNoEncontrada()
    ) : (
      resetearTemplateMedicamentos(),
      getProductsMedicamentos(MedicamentosFiltrados)
    )

  } else {
    let InputSearchMedicamento = document.querySelector('#BuscarMedicamento');
    let BusquedaMedicamento = InputSearchMedicamento.value.toLowerCase();
    let medicamentos;

    asc.checked ? (
      medicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenAsc)
    ) : (
      medicamentos = await ApiFetch(urlApi, tipoMedicamento, ordenDesc)
    )

    let MedicamentosFiltrados = medicamentos.products.filter(medicamento => {
      medicamento.nombre = medicamento.nombre.toLowerCase();
      medicamento.descripcion = medicamento.descripcion.toLowerCase();

      return (medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1);
    })

    MedicamentosFiltrados.length === 0 ? (
      resetearTemplateMedicamentos(),
      busquedaMedicamentoNoEncontrada()
    ) : (
      resetearTemplateMedicamentos(),
      getProductsMedicamentos(MedicamentosFiltrados)
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
// JS JUGUETES

function busquedaJugueteNoEncontrada() {
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

async function filtrar_juguetes() {

  let InputSearchJuguetes = document.querySelector('#BuscarJuguetes');
  let BusquedaJuguetes = InputSearchJuguetes.value.toLowerCase();

  let api = await ApiFetch(urlApi, tipoJuguete, ordenAsc);

  let JuguetesFiltrados = api?.products.filter(juguete => {
    juguete.nombre = juguete.nombre.toLowerCase();
    juguete.descripcion = juguete.descripcion.toLowerCase();

    return juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1;
  })

  if (JuguetesFiltrados.length === 0) {
    resetearTemplateJuguetes();
    busquedaJugueteNoEncontrada();
  } else {
    resetearTemplateJuguetes();
    getProductsJuguetes(JuguetesFiltrados)
  }

}

async function filtrarPreciosJuguete() {

  let minimo = Number(document.querySelector('#precioMinimoJuguete').value);
  let maximo = Number(document.querySelector('#precioMaximoJuguete').value);
  let desc = document.querySelector('#desc_jug');

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

    let InputSearchJuguetes = document.querySelector('#BuscarMedicamento');
    let BusquedaJuguetes = InputSearchJuguetes.value.toLowerCase();
    let Juguetes;

    desc.checked ? (
      Juguetes = await ApiFetch(urlApi, tipoJuguete, ordenDesc)
    ) : (
      Juguetes = await ApiFetch(urlApi, tipoJuguete, ordenAsc)
    )

    let JuguetesFiltrados = Juguetes.products.filter(juguete => {
      juguete.nombre = juguete.nombre.toLowerCase();
      juguete.descripcion = juguete.descripcion.toLowerCase();

      return (juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
    })

    JuguetesFiltrados.length === 0 ? (
      resetearTemplateJuguetes(),
      busquedaJugueteNoEncontrada()
    ) : (
      resetearTemplateJuguetes(),
      getProductsJuguetes(JuguetesFiltrados)
    )

  }

}

async function filtrarOrdenarJuguetes() {

  let minimo = Number(document.querySelector('#precioMinimoJuguete').value);
  let maximo = Number(document.querySelector('#precioMaximoJuguete').value);
  let InputSearchJuguetes = document.querySelector('#BuscarJuguetes');
  let BusquedaJuguetes = InputSearchJuguetes.value.toLowerCase();
  let Juguetes;

  let asc = document.querySelector('#asc_med');

  if (minimo && maximo) {

    asc.checked ? (
      Juguetes = await ApiFetch(urlApi, tipoJuguete, ordenAsc)
    ) : (
      Juguetes = await ApiFetch(urlApi, tipoJuguete, ordenDesc)
    )

    let JuguetesFiltrados = Juguetes.products.filter(juguete => {
      juguete.nombre = juguete.nombre.toLowerCase();
      juguete.descripcion = juguete.descripcion.toLowerCase();
      return (juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
    })

    JuguetesFiltrados.length === 0 ? (
      resetearTemplateJuguetes(),
      busquedaJugueteNoEncontrada()
    ) : (
      resetearTemplateJuguetes(),
      getProductsJuguetes(JuguetesFiltrados)
    )

  } else {

    asc.checked ? (
      Juguetes = await ApiFetch(urlApi, tipoJuguete, ordenAsc)
    ) : (
      Juguetes = await ApiFetch(urlApi, tipoJuguete, ordenDesc)
    )

    let JuguetesFiltrados = Juguetes.products.filter(juguete => {
      juguete.nombre = juguete.nombre.toLowerCase();
      juguete.descripcion = juguete.descripcion.toLowerCase();

      return (juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1);
    })

    JuguetesFiltrados.length === 0 ? (
      resetearTemplateJuguetes(),
      busquedaJugueteNoEncontrada()
    ) : (
      resetearTemplateJuguetes(),
      getProductsJuguetes(JuguetesFiltrados)
    )
  }

}