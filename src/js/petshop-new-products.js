const urlApi = "https://pro-talento.up.railway.app/api/mindy/products";
let data = new FormData();

let formulario = document.getElementById('FormRegistroProducto');

formulario.addEventListener('submit', async e => {
    e.preventDefault();
    try {

        for (let input of formulario) {
            if (input.name) {
                data[input.name] = input.value
            }
        }

        await fetch(urlApi, {
            method: 'POST',
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
                        timer: 2000
                    })
                    return await res.json();

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ocurrió un error en el proceso de registro.',
                        text: 'Verifica que los campos no estėn vacíos.',
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
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error en el proceso de registro.',
            text: err,
            timer: 3000
        })
        console.log(error);
    }
})


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