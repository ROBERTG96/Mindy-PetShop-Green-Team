const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";

async function ApiFetch() {
    let response = await fetch(urlApi);
    response = await response.json();
    return response;
}

const Card = document.getElementById("details_card");
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
          <h5 class="success"><i class="bi bi-tags success"></i> ${producto.tipo}</h5>
        </h4>
      
        <h4 class="card-text">
            <h5 class="success"><i class="bi bi-box-seam-fill success"></i> Stock Disponible</h5>
        </h4>

   
        ${producto.stock < 5 ? (
            `
          <h4 class="card-text">
          <h5 class="sucess_dark"><i class="bi bi-basket2"></i> Últimas unidades! (${producto.stock}) Unidad</h5>
          </h4>`
        ) : (
            `
          <h4 class="card-text">
          <h5 class="success"><i class="bi bi-basket2 success"></i> Cantidad: ${producto.stock} Unidad</h5>
          </h4>
          `
        )}

        <h4 class="card-text">
        <h5 class="success"><i class="bi bi-truck success"></i> Envíos a nivel nacional</h5>
      </h4>

        <h4 class="card-text">
        <h4 class="sucess_dark"><i class="bi bi-currency-dollar sucess_dark"></i>${producto.precio}</h4>
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
