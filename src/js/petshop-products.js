const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
const ordenAsc = '&orden=asc';
const ordenDesc = '&orden=desc';
const tipoMedicamento = '?tipo=medicamento';
const tipoJuguete = '?tipo=juguete';
const querys = '';


let ApiMedicamentos = new Array();
let ApiJuguetes = new Array();


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
    let apiAux = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '');

    if (apiAux.products.length != ApiMedicamentos.products.length) {
        let MedicamentosFiltrados = apiAux?.products.filter(medicamento => {
            medicamento.nombre = medicamento.nombre.toLowerCase();
            medicamento.descripcion = medicamento.descripcion.toLowerCase();
            return medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1;
        })

        if (MedicamentosFiltrados.length === 0) {
            resetearTemplateMedicamentos();
            busquedaMedicamentoNoEncontrada();
        } else {
            let nombreProducto = new Array();
            nombreProducto = MedicamentosFiltrados.map(product => {
                return product.nombre
            })
            let api = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '');

            let productoOriginal = api?.products.filter(med => {
                return nombreProducto.includes(med.nombre.toLowerCase())
            })

            console.log(productoOriginal);

            resetearTemplateMedicamentos();
            getProductsMedicamentos(productoOriginal)
        }
    } else {

        let MedicamentosFiltrados = ApiMedicamentos?.products.filter(medicamento => {
            medicamento.nombre = medicamento.nombre.toLowerCase();
            medicamento.descripcion = medicamento.descripcion.toLowerCase();
            return medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1;
        })

        if (MedicamentosFiltrados.length === 0) {
            resetearTemplateMedicamentos();
            busquedaMedicamentoNoEncontrada();
        } else {
            let nombreProducto = new Array();
            nombreProducto = MedicamentosFiltrados.map(product => {
                return product.nombre
            })

            let productoOriginal = apiAux?.products.filter(med => {
                return nombreProducto.includes(med.nombre.toLowerCase())
            })

            console.log(productoOriginal);

            resetearTemplateMedicamentos();
            getProductsMedicamentos(productoOriginal)
        }
    }



}

async function filtrarPrecios() {

    let minimo = Number(document.querySelector('#precioMinimo').value);
    let maximo = Number(document.querySelector('#precioMaximo').value);

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
        let checkedOrdenMedicamento = document.querySelector('#asc_med');

        if (apiAux.products.length != ApiMedicamentos.products.length) {

            let MedicamentosFiltrados = apiAux.products.filter(medicamento => {
                medicamento.nombre = medicamento.nombre.toLowerCase();
                medicamento.descripcion = medicamento.descripcion.toLowerCase();

                return (medicamento.nombre.indexOf(BusquedaMedicamento) > - 1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
            })

            if (MedicamentosFiltrados.length === 0) {
                resetearTemplateMedicamentos();
                busquedaMedicamentoNoEncontrada();
            } else {
                let nombreProducto = new Array();
                nombreProducto = MedicamentosFiltrados.map(product => {
                    return product.nombre
                })
                let api;
                checkedOrdenMedicamento.checked === true ? (
                    api = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')
                ) : (
                    api = await ApiFetch(urlApi, tipoMedicamento, ordenDesc, '')
                )

                let productoOriginal = api?.products.filter(medicamento => {
                    return nombreProducto.includes(medicamento.nombre.toLowerCase())
                })

                resetearTemplateMedicamentos();
                getProductsMedicamentos(productoOriginal)
            }
        } else {

            let MedicamentosFiltrados = ApiMedicamentos.products.filter(medicamento => {
                medicamento.nombre = medicamento.nombre.toLowerCase();
                medicamento.descripcion = medicamento.descripcion.toLowerCase();

                return (medicamento.nombre.indexOf(BusquedaMedicamento) > -1 || medicamento.descripcion.indexOf(BusquedaMedicamento) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
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

}

async function filtrarOrdenarMedicamentos() {

    let minimo = Number(document.querySelector('#precioMinimo').value);
    let maximo = Number(document.querySelector('#precioMaximo').value);
    let InputSearchJuguetes = document.querySelector('#BuscarMedicamento');
    let BusquedaJuguetes = InputSearchJuguetes.value.toLowerCase();
    let apiAux = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')
    let checkedOrdenJuguete = document.querySelector('#asc_med');

    if (minimo && maximo) {

        if (apiAux.products.length != ApiMedicamentos.products.length) {

            let MedicamentosFiltrados = apiAux.products.filter(medicamento => {
                medicamento.nombre = medicamento.nombre.toLowerCase();
                medicamento.descripcion = medicamento.descripcion.toLowerCase();

                return (medicamento.nombre.indexOf(BusquedaJuguetes) > -1 || medicamento.descripcion.indexOf(BusquedaJuguetes) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);
            })

            if (MedicamentosFiltrados.length === 0) {
                resetearTemplateMedicamentos();
                busquedaMedicamentoNoEncontrada();
            } else {
                let nombreProducto = new Array();
                nombreProducto = MedicamentosFiltrados.map(product => {
                    return product.nombre
                })
                let api;
                checkedOrdenJuguete.checked === true ? (
                    api = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')
                ) : (
                    api = await ApiFetch(urlApi, tipoMedicamento, ordenDesc, '')
                )

                let productoOriginal = api?.products.filter(medicamento => {
                    return nombreProducto.includes(medicamento.nombre.toLowerCase())
                })

                resetearTemplateMedicamentos();
                getProductsMedicamentos(productoOriginal)
            }
        } else {
            let api;
            checkedOrdenJuguete.checked === true ? (
                api = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')
            ) : (
                api = await ApiFetch(urlApi, tipoMedicamento, ordenDesc, '')
            )
            let ListaMedicamentoOrdenada = api.products.filter(medicamento => {
                return (medicamento.nombre.indexOf(BusquedaJuguetes) > -1 || medicamento.descripcion.indexOf(BusquedaJuguetes) > -1) && (medicamento.precio >= minimo && medicamento.precio <= maximo);

            })

            ListaMedicamentoOrdenada.length === 0 ? (
                resetearTemplateMedicamentos(),
                busquedaMedicamentoNoEncontrada()
            ) : (
                resetearTemplateMedicamentos(),
                getProductsMedicamentos(ListaMedicamentoOrdenada)
            )

        }

    } else {
        let MedicamentosFiltrados = apiAux.products.filter(medicamento => {
            medicamento.nombre = medicamento.nombre.toLowerCase();
            medicamento.descripcion = medicamento.descripcion.toLowerCase();

            return (medicamento.nombre.indexOf(BusquedaJuguetes) > -1 || medicamento.descripcion.indexOf(BusquedaJuguetes) > -1)
                && (medicamento.precio >= minimo && medicamento.precio <= maximo);
        })

        if (MedicamentosFiltrados.length === 0) {
            resetearTemplateMedicamentos();
            busquedaMedicamentoNoEncontrada();
        } else {

            let nombreProducto = new Array();
            nombreProducto = MedicamentosFiltrados.map(product => {
                return product.nombre
            })
            let api;
            checkedOrdenJuguete.checked === true ? (
                api = await ApiFetch(urlApi, tipoMedicamento, ordenAsc, '')
            ) : (
                api = await ApiFetch(urlApi, tipoMedicamento, ordenDesc, '')
            )

            let productoOriginal = api?.products.filter(medicamento => {
                return nombreProducto.includes(medicamento.nombre.toLowerCase())
            })

            resetearTemplateMedicamentos();
            getProductsMedicamentos(productoOriginal)
        }
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

    let InputSearchJuguetes = document.querySelector('#BuscarJuguetes');
    let BusquedaJuguetes = InputSearchJuguetes.value.toLowerCase();
    let apiAux = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '');

    if (apiAux.products.length != ApiJuguetes.products.length) {
        let JuguetesFiltrados = apiAux?.products.filter(juguete => {
            juguete.nombre = juguete.nombre.toLowerCase();
            juguete.descripcion = juguete.descripcion.toLowerCase();
            return juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1;
        })

        if (JuguetesFiltrados.length === 0) {
            resetearTemplateJuguetes();
            busquedaJugueteNoEncontrada();
        } else {
            let nombreProducto = new Array();
            nombreProducto = JuguetesFiltrados.map(product => {
                return product.nombre
            })

            let api = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '');

            let productoOriginal = api?.products.filter(juguete => {
                return nombreProducto.includes(juguete.nombre.toLowerCase())
            })

            resetearTemplateJuguetes();
            getProductsJuguetes(productoOriginal)
        }
    } else {

        let JuguetesFiltrados = ApiJuguetes?.products.filter(juguete => {
            juguete.nombre = juguete.nombre.toLowerCase();
            juguete.descripcion = juguete.descripcion.toLowerCase();
            return juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1;
        })

        if (JuguetesFiltrados.length === 0) {
            resetearTemplateJuguetes();
            busquedaJugueteNoEncontrada();
        } else {
            let nombreProducto = new Array();
            nombreProducto = JuguetesFiltrados.map(product => {
                return product.nombre
            })

            let productoOriginal = apiAux?.products.filter(juguete => {
                return nombreProducto.includes(juguete.nombre.toLowerCase())
            })

            resetearTemplateJuguetes();
            getProductsJuguetes(productoOriginal)
        }
    }
}

async function filtrarPreciosJuguete() {

    let minimo = Number(document.querySelector('#precioMinimoJuguete').value);
    let maximo = Number(document.querySelector('#precioMaximoJuguete').value);

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

        let InputSearchJuguetes = document.querySelector('#BuscarJuguetes');
        let BusquedaJuguetes = InputSearchJuguetes.value.toLowerCase();
        let apiAux = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')
        let checkedOrdenJuguete = document.querySelector('#asc_jug');


        if (apiAux.products.length != ApiJuguetes.products.length) {

            let JuguetesFiltrados = apiAux.products.filter(juguete => {
                juguete.nombre = juguete.nombre.toLowerCase();
                juguete.descripcion = juguete.descripcion.toLowerCase();

                return (juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
            })

            if (JuguetesFiltrados.length === 0) {
                resetearTemplateJuguetes();
                busquedaJugueteNoEncontrada();
            } else {
                let nombreProducto = new Array();
                nombreProducto = JuguetesFiltrados.map(product => {
                    return product.nombre
                })
                let api;
                checkedOrdenJuguete.checked === true ? (
                    api = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')
                ) : (
                    api = await ApiFetch(urlApi, tipoJuguete, ordenDesc, '')
                )

                let productoOriginal = api?.products.filter(juguete => {
                    return nombreProducto.includes(juguete.nombre.toLowerCase())
                })

                resetearTemplateJuguetes();
                getProductsJuguetes(productoOriginal)
            }
        } else {
            let JuguetesFiltrados = ApiJuguetes.products.filter(juguete => {
                juguete.nombre = juguete.nombre.toLowerCase();
                juguete.descripcion = juguete.descripcion.toLowerCase();

                return (juguete.nombre.indexOf(BusquedaJuguetes) > -1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
            })

            if (JuguetesFiltrados.length === 0) {
                resetearTemplateJuguetes();
                busquedaJugueteNoEncontrada();
            } else {
                resetearTemplateJuguetes();
                getProductsJuguetes(JuguetesFiltrados)
            }
        }
    }
}

async function filtrarOrdenarJuguetes() {

    let minimo = Number(document.querySelector('#precioMinimoJuguete').value);
    let maximo = Number(document.querySelector('#precioMaximoJuguete').value);
    let InputSearchJuguetes = document.querySelector('#BuscarJuguetes');
    let BusquedaJuguetes = InputSearchJuguetes.value.toLowerCase();
    let apiAux = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')
    let checkedOrdenJuguete = document.querySelector('#asc_jug');

    if (minimo && maximo) {

        if (apiAux.products.length != ApiJuguetes.products.length) {

            let JuguetesFiltrados = apiAux.products.filter(juguete => {
                juguete.nombre = juguete.nombre.toLowerCase();
                juguete.descripcion = juguete.descripcion.toLowerCase();

                return (juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
            })

            if (JuguetesFiltrados.length === 0) {
                resetearTemplateJuguetes();
                busquedaJugueteNoEncontrada();
            } else {
                let nombreProducto = new Array();
                nombreProducto = JuguetesFiltrados.map(product => {
                    return product.nombre
                })
                let api;
                checkedOrdenJuguete.checked === true ? (
                    api = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')
                ) : (
                    api = await ApiFetch(urlApi, tipoJuguete, ordenDesc, '')
                )

                let productoOriginal = api?.products.filter(juguete => {
                    return nombreProducto.includes(juguete.nombre.toLowerCase())
                })

                resetearTemplateJuguetes();
                getProductsJuguetes(productoOriginal)
            }
        } else {

            let JuguetesFiltrados = ApiJuguetes.products.filter(juguete => {
                juguete.nombre = juguete.nombre.toLowerCase();
                juguete.descripcion = juguete.descripcion.toLowerCase();

                return (juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1) && (juguete.precio >= minimo && juguete.precio <= maximo);
            })

            if (JuguetesFiltrados.length === 0) {
                resetearTemplateJuguetes();
                busquedaJugueteNoEncontrada();
            } else {
                let nombreProducto = new Array();
                nombreProducto = JuguetesFiltrados.map(product => {
                    return product.nombre
                })
                let api;
                checkedOrdenJuguete.checked === true ? (
                    api = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')
                ) : (
                    api = await ApiFetch(urlApi, tipoJuguete, ordenDesc, '')
                )
                let productoOriginal = api.products.filter(juguete => {
                    return nombreProducto.includes(juguete.nombre.toLowerCase())
                })
                console.log(productoOriginal);
                resetearTemplateJuguetes();
                getProductsJuguetes(productoOriginal)
            }
        }
    } else {
        let JuguetesFiltrados = apiAux.products.filter(juguete => {
            juguete.nombre = juguete.nombre.toLowerCase();
            juguete.descripcion = juguete.descripcion.toLowerCase();

            return (juguete.nombre.indexOf(BusquedaJuguetes) > - 1 || juguete.descripcion.indexOf(BusquedaJuguetes) > -1);
        })

        if (JuguetesFiltrados.length === 0) {
            resetearTemplateJuguetes();
            busquedaJugueteNoEncontrada();
        } else {

            let nombreProducto = new Array();
            nombreProducto = JuguetesFiltrados.map(product => {
                return product.nombre
            })
            let api;
            checkedOrdenJuguete.checked === true ? (
                api = await ApiFetch(urlApi, tipoJuguete, ordenAsc, '')
            ) : (
                api = await ApiFetch(urlApi, tipoJuguete, ordenDesc, '')
            )

            let productoOriginal = api?.products.filter(juguete => {
                return nombreProducto.includes(juguete.nombre.toLowerCase())
            })

            resetearTemplateJuguetes();
            getProductsJuguetes(productoOriginal)
        }
    }
}

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