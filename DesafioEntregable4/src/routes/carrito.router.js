import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const carritoRouter = Router();
const carrito = new CartManager();

carritoRouter.get('/', async (req, res) => {
    res.send(await carrito.readCarts());
})

carritoRouter.get('/:cid', async (req, res) => {
    res.send(await carrito.getCartsById(req.params.cid));
})

carritoRouter.post('/', async (req, res) => {
    res.send(await carrito.addCarts());
});

carritoRouter.post('/:cid/products/:pid', async (req, res) => {
    let carritoId = req.params.cid;
    let productoId = req.params.pid;
    res.send(await carrito.addProductInCart(carritoId, productoId));
});


export default carritoRouter;