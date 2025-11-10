const asientos = document.querySelector(".asientos");
const asientosseleccionados = document.getElementById("cantidadasientosseleccionados");
const cantidadboletos = document.getElementById("cantidadboletos");
const subtotal = document.getElementById("subtotal");
const listaproductos = document.querySelector(".listaproductos");
const listacarrito = document.getElementById("listacarrito");
const subtotalalimetos = document.getElementById("subtotalalimetos");
const totalfinal = document.getElementById("totalfinal");
const panelcancelar = document.getElementById('eliminarproducto');
const nombreproductocancelado = document.getElementById('nombreproducto');
const codigo = document.getElementById('inputcodigo');
const btnconfirmareliminar = document.getElementById('btnconfirmar');
const btncancelarelpanel = document.getElementById('btncancelar');
const totalapagar = document.getElementById('totalapagar');
const tarjeta = document.getElementById('tarjeta');
const efectivo = document.getElementById('efectivo');
const btnpagartodo = document.querySelector('section > button');

let costoboleto = 50;
let subtotalboletos;
let carrito = [];
let productocancelado = null;

if (asientos != null) {
    asientos.addEventListener("click", function (e) {
        let asiento = e.target;

        if (asiento.tagName == "SPAN" && !asiento.classList.contains("ocupado")) {
            asiento.classList.toggle("seleccionado");

            carritoBoletos();
        }
    });
}

carritoBoletos();
carritoAlimentos();

function carritoBoletos() {
    if (asientos != null) {
        const contarseleccionados = asientos.querySelectorAll(".seleccionado");

        let cantidadasientos = contarseleccionados.length;
        asientosseleccionados.textContent = cantidadasientos;
        cantidadboletos.textContent = cantidadasientos;

        subtotalboletos = cantidadasientos * costoboleto;
        subtotal.textContent = `$${parseInt(subtotalboletos)}.00`;

        localStorage.setItem('subtotalboletos', subtotalboletos.toString());
    }
}

if (listaproductos != null) {
    listaproductos.addEventListener("click", function (e) {
        let elemento = e.target;

        if (elemento.classList.contains("agregar")) {
            const datosproducto = elemento.closest('.producto');

            if (datosproducto) {
                const idproducto = datosproducto.id;
                const nombredelproductoe = datosproducto.querySelector('h3');
                const nombredelproducto = nombredelproductoe ? nombredelproductoe.textContent : '';
                const precioproducto = datosproducto.querySelector('div > span');
                const precio = precioproducto ? parseFloat(precioproducto.textContent.replace('$', '').trim()) : 0;

                if (idproducto && nombredelproducto && precio > 0) {
                    agregarCarritoAlimentos(idproducto, nombredelproducto, precio);
                }
            }
        }
    });
}

function carritoAlimentos() {
    if (listacarrito == null) return;
    const subtotalcarritoboletos = localStorage.getItem('subtotalboletos');
    const subtotalcarritob = subtotalcarritoboletos ? parseFloat(subtotalcarritoboletos) : 0;

    listacarrito.replaceChildren();
    let totalalimentos = 0; 

    carrito.forEach(item => {
        const li = document.createElement("li");

        li.dataset.id = item.idproducto;

        let subtotalalimentos = item.cantidad * item.precio;
        totalalimentos += subtotalalimentos;

        li.innerHTML = `
            <span>${item.nombredelproducto}</span>
            <div>
                <span>${item.cantidad}</span>
                <a>x</a>
            </div>
        `;
        listacarrito.appendChild(li);
    });

    let totalalimentosyboletos = subtotalcarritob + totalalimentos;
    localStorage.setItem('totalFinalCompra', totalalimentosyboletos.toString());

    if (subtotalalimetos != null) {
        subtotalalimetos.textContent = `$${parseInt(totalalimentos)}.00`;
    }
    if (totalfinal != null) {
        totalfinal.textContent = `$${parseInt(totalalimentosyboletos)}.00`;
    }
}

function agregarCarritoAlimentos(idproduct, nombredelproduct, precioo) {
    let existente = carrito.find(item => item.idproducto == idproduct);

    if (existente!=null) {
        existente.cantidad++;
    }
    else
    {
        carrito.push({
            idproducto: idproduct,
            nombredelproducto: nombredelproduct,
            precio: precio0,
            cantidad: 1
        });
    }
    carritoAlimentos();
}

if (btnconfirmareliminar != null) {
    btnconfirmareliminar.addEventListener("click", function () {
        const codigoeliminar = "1234";

        if (productocancelado) {
            if (codigo.value == codigoeliminar) {
                eliminarProducto(productocancelado);
                codigo.value = '';
            }
            else {
                codigo.value = ''; 
                codigo.focus();
            }
        }
    });
}

if (btncancelarelpanel != null) {
    btncancelarelpanel.addEventListener("click", function () {
        if (panelcancelar) {
            panelcancelar.hidden = true; 
            productocancelado = null;
            inputCodigo.value = ''; 
        }
    });
}

if (listacarrito != null) {
    listacarrito.addEventListener("click", function (e) {
        if (e.target.tagName == 'A' && e.target.textContent == 'x') {
            const div = e.target.parentNode;
            const li = div.parentNode;

            if (li) {
                productocancelado = li.dataset.id;
                const nombreproducto = li.querySelector('span:nth-of-type(1)').textContent;

                if (panelcancelar && nombreproductocancelado) {
                    nombreproductocancelado.textContent = nombreproducto;
                    panelcancelar.hidden = false;
                }
            }
        }
    });
}

function eliminarProducto(idproducto) {
    carrito = carrito.filter(item => item.idproducto != idproducto);

    if (panelcancelar) {
        panelcancelar.hidden = true;
        productocancelado = null;
    }
    
    carritoAlimentos();
}

if (totalapagar != null) {
    const totalFinalString = localStorage.getItem('totalFinalCompra');
    let totalParaPago = totalFinalString ? parseFloat(totalFinalString) : 0;

    totalapagar.textContent = `$${parseInt(totalParaPago)}.00`;
}

function finalizarPago() {
    localStorage.removeItem('totalFinalCompra');
    localStorage.removeItem('subtotalboletos');
}

if (tarjeta != null && efectivo != null) {
    tarjeta.addEventListener("click", function () {
        tarjeta.classList.add("metodopago");
        efectivo.classList.remove("metodopago");
    });

    efectivo.addEventListener("click", function () {
        efectivo.classList.add("metodopago");
        tarjeta.classList.remove("metodopago");
    });
}

if (btnpagartodo != null) {
    btnpagartodo.addEventListener("click", finalizarPago);
}