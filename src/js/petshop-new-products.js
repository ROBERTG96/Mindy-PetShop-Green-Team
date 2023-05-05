const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
let data = new FormData();

async function NuevoProducto() {

    let nombre = document.getElementsByName('nombre')[0].value;
    let descripcion = document.getElementsByName('descripcion')[0].value;
    let imagen = document.getElementsByName('imagen')[0].value;
    let tipo = document.getElementsByName('tipo')[0].value;
    let precio = document.getElementsByName('precio')[0].value;
    let stock = document.getElementsByName('stock')[0].value;

    data = {
        nombre,
        descripcion,
        imagen,
        tipo,
        precio,
        stock
    }

    await fetch(urlApi, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(data)
    })
        .then(async res => {
            if (res.status <= 201) {
              
                document.getElementById("FormRegistroProducto").reset();
                document.getElementsByName('nombre')[0].focus();
                Swal.fire({
                    icon: 'success',
                    title: 'Producto registrado con éxito',
                    text: 'Nuevo producto agregado al stock.',
                    timer: 3000
                })
                return await res.json();

            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error en el proceso de registro.',
                    text:  'Verifica que los campos no estėn vacíos.',
                    timer: 3000
                })
            }
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error en el proceso de registro.',
                text: err,
                timer: 3000
            })
            console.log(err);
        });

}


function LimpiarFormulario() {
    document.getElementById("FormRegistroProducto").reset();
    document.getElementsByName('nombre')[0].focus();

    Swal.fire({
        icon: 'info',
        title: 'Formulario limpiado.',
        text: 'Registra un nuevo producto!',
        timer: 2000
    })

}