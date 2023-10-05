import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const managerProduct = new ProductManager();

let instanciaSocket;

router.get("/", async (req, res) => {
    const productos = await managerProduct.getProducts();
    res.status(200).render("home", { productos, style: 'index.css' });
});

router.get("/realtimeproducts", async (req, res) => {
    const productos = await managerProduct.getProducts();
    res.status(200).render("realTimeProducts", { productos, style: 'index.css' });
});

router.post("/realtimeproducts", async (req, res) => {

    const productos = await managerProduct.getProducts();
    const producto = req.body;

    if (producto.title && producto.description && producto.code && producto.price && producto.status && producto.stock && producto.category) {
        
        await managerProduct.addProducts(producto);

        instanciaSocket.emit("servidor:nuevoProducto", producto);

        res.status(200).render("realTimeProducts", { productos });

    } else return res.status(400).send({ status: "error", message: "Ingrese todos los campos requeridos"
    
    });
});

router.delete("/:pid", (req, res) => {
    const pid = req.params.pid;
    const ProductoEliminado = managerProduct.deleteProducts(pid);

    if(ProductoEliminado) {

        instanciaSocket.emit("servidor:eliminarProducto", pid);
        return res.status(200).send({ status: "success", message: "Producto eliminado correctamente" });

    } else {
        return res.status(404).send({message: "Producto no encontrado"});
    }
});

export default router;