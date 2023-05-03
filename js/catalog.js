const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
let Api = new Array();
let ApiMedicamentos = new Array();
let ApiJuguetes = new Array();

async function getApi(urlApi) {
    try {
        let response = await fetch(urlApi);
        response = await response.json();
        Api = response.products;
        ApiMedicamentos = response.products.filter(categoria => categoria.tipo === "Medicamento");
        ApiJuguetes = response.products.filter(categoria => categoria.tipo === "Juguete");
        getProducts(ApiMedicamentos, ApiJuguetes);
    } catch (error) {
        console.error(error);
    }
}

getApi(urlApi);


const cardsContainerMedicamentos = document.getElementById("cards-container-medicamentos");
const cardsContainerJuguetes = document.getElementById("cards-container-juguetes");

function getProducts(medicamentos, juguetes) {
    console.log(medicamentos);
    medicamentos.forEach((medicamento) => {
        let card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
      <div class="card h-100">
        <img src="${medicamento.imagen}" class="card-img-top" alt="${medicamento.nombre}">
        <div class="card-body mb-3">
          <h5 class="card-title mb-3">${medicamento.nombre}</h5>
          <div class="row mb-3">
            <div class="col-6">
              <p class="card-text"><i class="fas fa-dollar-sign"></i> ${medicamento.precio}</p>
            </div>
            <div class="col-6">
            <p class="card-text"><i class="fas fa-tags"></i> ${medicamento.tipo}</p>
          </div>
          </div>
          <p class="card-text mb-3">${medicamento.descripcion}</p>
          <div class="input-group mb-3">
            <button class="btn btn-outline-secondary" type="button" id="button-minus-0">-</button>
            <input type="text" class="form-control" placeholder="Cantidad" aria-label="Cantidad" value="0" id="quantity-0">
            <button class="btn btn-outline-secondary" type="button" id="button-plus-0">+</button>
            <span class="input-group-text">Existencias: <span id="stock-0">${medicamento.stock}</span></span>
          </div>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-primary position-absolute bottom-0 mb-2" onclick="agregarAlCarrito(${JSON.stringify(medicamento)})">
              <i class="fas fa-shopping-cart"></i> Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    `;
        cardsContainerMedicamentos.appendChild(card);
    });

    ApiJuguetes.forEach((Juguetes) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
    <div class="card h-100">
      <img src="${Juguetes.imagen}" class="card-img-top" alt="${Juguetes.nombre}">
      <div class="card-body mb-3">
        <h5 class="card-title mb-3">${Juguetes.nombre}</h5>
        <div class="row mb-3">
          <div class="col-6">
            <p class="card-text"><i class="fas fa-dollar-sign"></i> ${Juguetes.precio}</p>
          </div>
          <div class="col-6">
          <p class="card-text"><i class="fas fa-tags"></i> ${Juguetes.tipo}</p>
        </div>
        </div>
        <p class="card-text mb-3">${Juguetes.descripcion}</p>
        <div class="input-group mb-3">
          <button class="btn btn-outline-secondary" type="button" id="button-minus-0">-</button>
          <input type="text" class="form-control" placeholder="Cantidad" aria-label="Cantidad" value="0" id="quantity-0">
          <button class="btn btn-outline-secondary" type="button" id="button-plus-0">+</button>
          <span class="input-group-text">Existencias: <span id="stock-0">${Juguetes.stock}</span></span>
        </div>
        <div class="d-flex justify-content-center">
          <button type="button" class="btn btn-primary position-absolute bottom-0 mb-2" onclick="agregarAlCarrito(${JSON.stringify(Juguetes)})">
            <i class="fas fa-shopping-cart"></i> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `;
        cardsContainerJuguetes.appendChild(card);
    });
}