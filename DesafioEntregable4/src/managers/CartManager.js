import {promises as fs} from 'fs';
import {nanoid} from "nanoid";
import ProductManager from "./ProductManager.js"

const productoAll = new ProductManager();

class CartManager {
    constructor() {
        this.path = "./src/models/carrito.json";
    }

    readCarts = async () => {
        let carritos = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carritos);
    }
    
    writeCarts = async (carrito) => {
        await fs.writeFile(this.path, JSON.stringify(carrito, null, '\t'));
    }

    exist = async (id) => {
        let carritos = await this.readCarts();
        return carritos.find(prod => prod.id === id);
    }
    
    addCarts = async () => {
        let carritosOld = await this.readCarts();
        let id = nanoid(3);
        let carritosConcat = [{id : id, productos: []}, ...carritosOld];
        await this.writeCarts(carritosConcat);
        return "carrito agregado exitosamente";
    }

    getCartsById = async (cid) => {
        let carritosPorId = await this.exist(cid);
        if(!carritosPorId) return "Carrito no encontrado";
        return carritosPorId;
    };

    addProductInCart = async (carritoId, productoId) => {

        let carritosPorId = await this.exist(carritoId);
        if(!carritosPorId) return "Carrito no encontrado";
        let productoById = await productoAll.exist(productoId);
        if(!productoById) return "Producto no encontrado"

        let carritosAll = await this.readCarts()
        let carritofilter = carritosAll.filter(carrito => carrito.id != carritoId);

        if(carritosPorId.productos.some((prod) => prod.id === productoId)) {
            let MasProductosEnCarrito = carritosPorId.productos.find(
                (prod) => prod.id === productoId
            )
            MasProductosEnCarrito.cantidad++;
            let carritosConcat = [carritosPorId, ...carritofilter];
            await this.writeCarts(carritosConcat);
            return "Producto sumado al carrito";
        }

        carritosPorId.productos.push({ id:productoById.id, cantidad: 1 });

        let carritosConcat = [carritosPorId, ...carritofilter];
        await this.writeCarts(carritosConcat);
        return "Producto Agregado al carrito";
    }
}

export default CartManager

