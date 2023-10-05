const socket = io();

const formulario = document.getElementById("formulario");
const buttonDelete = document.querySelectorAll(".delete-button");
const textbox = document.getElementById("textbox");

const addProduct = (producto) => {
    socket.emit("cliente:nuevoProducto", producto);
};

const updateProducts = (productos) => {
    textbox.innerHTML = "";

productos.forEach((producto) => {
    const nuevoProducto = document.createElement("li");

        nuevoProducto.innerHTML = `
            <div class="producto_detail_agregado_container" id="producto-${producto.id}">
                <p class="product_detail_agregado">Id: ${producto.id}</p>
                <p class="product_detail_agregado">Producto: ${producto.title}</p>
                <p class="product_detail_agregado">Descripción: ${producto.description}</p>
                <p class="product_detail_agregado">Codigo: ${producto.code}</p>
                <p class="product_detail_agregado">Precio: ${producto.price}</p>
                <p class="product_detail_agregado">Disponibilidad: ${producto.status}</p>
                <p class="product_detail_agregado">Stock: ${producto.stock}</p>
                <p class="product_detail_agregado">Categoria: ${producto.category}</p>
                <p class="product_detail_agregado">Imagen: ${producto.thumbnails}</p>

                <button class="delete-button buton-eliminar-producto" data-id="${producto.id}">Eliminar producto</button>
            </div>
        `;

        textbox.appendChild(nuevoProducto);
    });
};

socket.on("servidor:renderizarListaProducto", async () => {
    socket.emit("cliente:renderizarListaProducto");
});

socket.on("servidor:actualizarListaProducto", (productos) => {
    updateProducts(productos);
});

socket.on("servidor:eliminarProducto", (pid) => {
    const productoEliminado = document.getElementById(`producto-${pid}`);
    if (productoEliminado) {
        productoEliminado.remove();
    }
});

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title");

    const description = document.getElementById("description");

    const code = document.getElementById("code");

    const price = document.getElementById("price");

    const availability = document.getElementById("status");

    const stock = document.getElementById("stock");

    const category = document.getElementById("category");

    const thumbnails = document.getElementById("thumbnails");

    const producto = {
        title: title.value,
        description: description.value,
        code: Number(code.value),
        price: Number(price.value),
        status: Boolean(availability.value),
        stock: Number(stock.value),
        category: category.value,
        thumbnails: thumbnails.value,
    };

    addProduct(producto);
});

textbox.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-button")) {
        const pid = e.target.getAttribute("data-id");
        socket.emit("cliente:eliminarProducto", pid);
    }
});