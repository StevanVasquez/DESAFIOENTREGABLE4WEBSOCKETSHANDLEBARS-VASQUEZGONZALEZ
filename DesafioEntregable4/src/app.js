import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import viewsRouter from "./routes/views.router.js";
import productoRouter from "./routes/producto.router.js";
import carritoRouter from "./routes/carrito.router.js";
import __dirname from './utils.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const manager = new ProductManager();

app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productoRouter);
app.use("/api/carts", carritoRouter);

const server = app.listen(8080, () => console.log('Running on port 8080'));

const socketServer = new Server(server);

socketServer.on("connection", socket => {
    console.log("Cliente conectado");

    socket.on("cliente:nuevoProducto", (producto) => {
        manager.addProducts(producto); 
    });
    
    socket.on("cliente:eliminarProducto", async pid => {
        await manager.deleteProducts(pid);
    });
    
    socket.emit("servidor:renderizarListaProducto");

    socket.on("cliente:renderizarListaProducto", async () => {
        const productos = await manager.getProducts();
        socketServer.emit("servidor:actualizarListaProducto", productos);
    });
});