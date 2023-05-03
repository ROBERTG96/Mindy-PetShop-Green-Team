console.log('CARGANDO LOGIN');
let adminUser = 'admin'
let passwordUser = '123*'
let username = document.querySelector('#username');
let password = document.querySelector('#password');

function getUserLogin() {

    let user = localStorage.getItem('username');

    if (user) {
        Swal.fire({
            title: 'Info!',
            text: 'Ya tienes una sesión iniciada, redireccionando!',
            icon: 'info',
            confirmButtonText: 'Ok',
            timer: 5000,
        })

        setTimeout(() => {
            window.location = "petshop-home.html"
        }, 1000);
    }
}

getUserLogin();

function login() {

    if (username.value === adminUser && password.value === passwordUser) {
        Swal.fire({
            title: 'Success!',
            text: 'Inicio de sesión exitoso!',
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 1000,
        })

        setTimeout(() => {
            window.location = "petshop-home.html"
        }, 1000);

        localStorage.setItem('username', JSON.stringify(username.value));

        username.value = '';
        password.value = '';

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Usuario o contraseña inválido.',
            icon: 'error',
            confirmButtonText: 'Ok'
        })

        username.value = '';
        password.value = '';
        username.focus();
    }
}

function logout() {
    localStorage.clear('username');

    Swal.fire({
        title: 'Info!',
        text: 'Cerrando sesión, redireccionando!',
        icon: 'info',
        confirmButtonText: 'Ok',
        timer: 3000,
    })

    setTimeout(() => {
        window.location = "petshop-products.html"
    }, 1000);
}
