document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LÓGICA DE LA PÁGINA DE BIENVENIDA
    // ==========================================
    const btnEntrar = document.getElementById('btnEntrar');
    if (btnEntrar) {
        btnEntrar.addEventListener('click', () => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = "index.html";
            }, 500);
        });
    }

    // Botones de Redes Sociales en JS
    const btnFacebook = document.getElementById('btnFacebook');
    const btnWhatsapp = document.getElementById('btnWhatsapp');

    if (btnFacebook) {
        btnFacebook.addEventListener('click', () => {
            // El '_blank' abre la página en una pestaña nueva
            window.open('https://www.facebook.com/share/188rBh7F7Q/', '_blank');
        });
    }

    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', () => {
            window.open('https://wa.me/523313434043', '_blank');
        });
    }

    // Solución BFCache para el botón "Atrás" en navegadores móviles
    window.addEventListener('pageshow', (event) => {
        if (event.persisted || document.body.classList.contains('fade-out')) {
            document.body.classList.remove('fade-out');
            document.body.style.display = 'none';
            document.body.offsetHeight; // Forzar re-render
            document.body.style.display = ''; // Restaurar el display original
        }
    });

    // ==========================================
    // 2. LÓGICA DEL MENÚ MÓVIL
    // ==========================================
    const botonMenu = document.getElementById('sidebarToggle');
    const menuDesplegable = document.getElementById('mobileMenu');

    if (botonMenu && menuDesplegable) {
        const enlacesMenu = document.querySelectorAll('.mobile-nav-links a');
        const iconoMenu = botonMenu.querySelector('i');

        botonMenu.addEventListener('click', () => {
            menuDesplegable.classList.toggle('active');
            const estaAbierto = menuDesplegable.classList.contains('active');

            if (estaAbierto) {
                iconoMenu.classList.remove('fa-bars');
                iconoMenu.classList.add('fa-xmark');
            } else {
                iconoMenu.classList.remove('fa-xmark');
                iconoMenu.classList.add('fa-bars');
            }
        });

        // Cerrar menú al tocar un enlace
        enlacesMenu.forEach(link => {
            link.addEventListener('click', () => {
                menuDesplegable.classList.remove('active');
                iconoMenu.classList.remove('fa-xmark');
                iconoMenu.classList.add('fa-bars');
            });
        });
    }

    // Quitar focus de botones al hacer clic fuera
    document.addEventListener('click', (e) => {
        const activo = document.activeElement;
        if (activo && activo.tagName === 'BUTTON' && !e.target.closest('button')) {
            activo.blur();
        }
    });

});

// ==========================================
// 3. FUNCIONES GLOBALES (CARRUSEL RESPONSIVO)
// ==========================================
let indice = 0;

window.moverCarrusel = function (direccion) {
    const carrusel = document.getElementById('carrusel');
    if (!carrusel) return;

    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Detectar cuántas tarjetas se ven en pantalla
    let itemsPorVista = 1; // Móvil
    if (window.innerWidth >= 1024) {
        itemsPorVista = 3; // Escritorio
    } else if (window.innerWidth >= 768) {
        itemsPorVista = 2; // Tablet
    }

    const indiceMaximo = totalSlides - itemsPorVista;
    indice += direccion;

    if (indice > indiceMaximo) {
        indice = 0;
    } else if (indice < 0) {
        indice = indiceMaximo;
    }

    const anchoSlide = 100 / itemsPorVista;
    const desplazamiento = -indice * anchoSlide;

    carrusel.style.transform = `translateX(${desplazamiento}%)`;
};

// ==========================================
// 4. LÓGICA DEL FORMULARIO DE CONTACTO (FORMSPREE)
// ==========================================
const formContacto = document.getElementById('formContacto');
const formStatus = document.getElementById('formStatus');

if (formContacto) {
    formContacto.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita que la página te mande a la web de Formspree

        const formData = new FormData(this);
        const botonSubmit = this.querySelector('input[type="submit"]');
        const textoOriginal = botonSubmit.value;

        // Cambia el texto del botón mientras envía
        botonSubmit.value = 'Enviando...';
        botonSubmit.disabled = true;

        try {
            // Envía los datos a Formspree usando Fetch API
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#25D366'; // Color verde
                formStatus.textContent = '¡Gracias por tu mensaje! Nos pondremos en contacto pronto.';
                this.reset(); // Limpia los campos del formulario
            } else {
                formStatus.style.display = 'block';
                formStatus.style.color = 'red';
                formStatus.textContent = 'Hubo un problema al enviar el formulario.';
            }
        } catch (error) {
            formStatus.style.display = 'block';
            formStatus.style.color = 'red';
            formStatus.textContent = 'Error de conexión. Intenta de nuevo.';
        } finally {
            // Restaura el botón a su estado normal
            botonSubmit.value = textoOriginal;
            botonSubmit.disabled = false;

            // Oculta el mensaje después de 5 segundos
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    });
}