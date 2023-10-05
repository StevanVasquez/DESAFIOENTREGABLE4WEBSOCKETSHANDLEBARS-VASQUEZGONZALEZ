import { Router } from 'express';
import ProductManager from "../managers/ProductManager.js";

const productoRouter = Router();
const producto = new ProductManager();

productoRouter.get('/', async (req, res) => {
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(await producto.getProducts());
    let todosLosProductos = await producto.getProducts();
    let limiteProducts = todosLosProductos.slice(0, limit);
    res.send(limiteProducts);
});

productoRouter.get('/:pid', async (req, res) => {
    let pid = req.params.pid;
    res.send(await producto.getProductsById(pid));
});

productoRouter.post('/', async (req, res) => {
    let productoNew = req.body;
    if(!productoNew.title || !productoNew.description || !productoNew.code || !productoNew.category 
    || !productoNew.status || !productoNew.price || !productoNew.stock || !productoNew.thumbnails) {
        return res.status(400).send({ status: 'error', error: 'Valores incompletos, todos los campos son obligatorios'});
    }
    res.send(await producto.addProducts(productoNew));
});

productoRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let actualizarProducto = req.body;
    if(!actualizarProducto.title || !actualizarProducto.description || !actualizarProducto.code || !actualizarProducto.category 
    || !actualizarProducto.status || !actualizarProducto.price || !actualizarProducto.stock || !actualizarProducto.thumbnails) {
        return res.status(400).send({ status: 'error', error: 'Valores incompletos, todos los campos son obligatorios'});
    }
    res.send(await producto.updateProducts(pid, actualizarProducto));
});

productoRouter.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;
    res.send(await producto.deleteProducts(pid));
});

export default productoRouter;