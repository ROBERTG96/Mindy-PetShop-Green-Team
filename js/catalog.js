const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
let Api = new Array();

async function getApi(urlApi) {
    try {
        let response = await fetch(urlApi);
        response = await response.json();
        Api = response.products;
        console.log(response);
        getProducts(Api);
    } catch (error) {
        console.error(error);
    }
}

getApi(urlApi);


const cardsContainer = document.getElementById("cards-container");

function getProducts(Api) {
    console.log(Api);
    Api.forEach((Api) => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
      <div class="card h-100">
        <img src="${Api.imagen}" class="card-img-top" alt="${Api.nombre}">
        <div class="card-body mb-3">
          <h5 class="card-title mb-3">${Api.nombre}</h5>
          <div class="row mb-3">
            <div class="col-6">
              <p class="card-text"><i class="fas fa-dollar-sign"></i> ${Api.precio}</p>
            </div>
            <div class="col-6">
            <p class="card-text"><i class="fas fa-tags"></i> ${Api.tipo}</p>
          </div>
          </div>
          <p class="card-text mb-3">${Api.descripcion}</p>
          <div class="input-group mb-3">
            <button class="btn btn-outline-secondary" type="button" id="button-minus-0">-</button>
            <input type="text" class="form-control" placeholder="Cantidad" aria-label="Cantidad" value="0" id="quantity-0">
            <button class="btn btn-outline-secondary" type="button" id="button-plus-0">+</button>
            <span class="input-group-text">Existencias: <span id="stock-0">${Api.stock}</span></span>
          </div>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-primary position-absolute bottom-0 mb-2" onclick="agregarAlCarrito(${JSON.stringify(Api)})">
              <i class="fas fa-shopping-cart"></i> Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    `;
        cardsContainer.appendChild(card);
    });
}

getProducts(Api);