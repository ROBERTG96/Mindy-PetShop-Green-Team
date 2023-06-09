window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

function MostarAdmin() {

    let userAdmin = localStorage.getItem('username');
    let mostrar = document.getElementById('mostrar');
    if (mostrar) {
        userAdmin ? (
            mostrar.innerHTML = `
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="./petshop-new-products.html" target="_blank"> <i class="bi bi-patch-plus-fill btn-icon"></i> Nuevo Producto</a>
        <a class="dropdown-item" onclick="logout()"> <i class="bi bi-door-closed-fill btn-icon"></i> Cerrar Sesión</a>`
        ) : (
            mostrar.innerHTML = `
            <a class="dropdown-item" href="./petshop-login.html" target="_blank"> <i class="bi bi-door-open-fill btn-icon"></i> Iniciar Sesión</a>
            <div class="dropdown-divider"></div>
           `
        )
    }
}

MostarAdmin();

function logout() {
    localStorage.clear('username');

    Swal.fire({
        icon: 'info',
        title: '¡Cerrando sesión!',
        text: 'redireccionando a la página de inicio!',
        confirmButtonText: 'Ok',
        timer: 4000,
    })

    setTimeout(() => {
        window.location = "petshop-home.html"
    }, 2000);
}

function ValidarRutaNuevoProducto() {

    let user = localStorage.getItem('username');
    let rutaLogin = window.location.pathname;

    if (rutaLogin === '/src/petshop-new-products.html') {
        if (!user) {
            let form = document.getElementById("FormRegistroProducto")
            form.style.visibility = 'hidden';

            Swal.fire({
                icon: 'info',
                title: '¡No eres admin de la aplicación!',
                text: 'Debes ser administrador para registrar productos, redireccionando al login!',
                confirmButtonText: 'Ok',
                timer: 3000,
            })

            setTimeout(() => {
                window.location = "petshop-login.html"
            }, 3000);
        }
    }
}

ValidarRutaNuevoProducto();