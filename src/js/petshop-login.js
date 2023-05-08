let adminUser = 'admin'
let passwordUser = '123*'
let username = document.querySelector('#username');
let password = document.querySelector('#password');


function getUserLogin() {

    let user = localStorage.getItem('username');
    let rutaLogin = window.location.pathname;

    if (rutaLogin === '/src/petshop-login.html') {
        if (user) {
            Swal.fire({
                icon: 'info',
                title: '¡Eres el Administrador!',
                text: 'Ya tienes una sesión iniciada, redireccionando!',
                confirmButtonText: 'Ok',
                timer: 3000,
            })

            setTimeout(() => {
                window.location = "petshop-new-products.html"
            }, 2000);
        }
    }
}

getUserLogin();

function login() {

    if (username.value === adminUser && password.value === passwordUser) {
        Swal.fire({
            title: 'Login - Administrador',
            text: 'Inicio de sesión exitoso!',
            icon: 'success',
            confirmButtonText: 'Bienvenido',
            timer: 2000,
        })

        setTimeout(() => {
            window.location = "petshop-new-products.html"
        }, 2000);

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



