import {promises as fs} from 'fs';
import {nanoid} from "nanoid";

export default class ProductManager {
    constructor() {
        this.path = "./src/models/products.json"
    }

    readProducts = async () => {
        let productos = await fs.readFile(this.path, "utf-8");
        return JSON.parse(productos);
    }

    writeProducts = async (producto) => {
        await fs.writeFile(this.path, JSON.stringify(producto, null, '\t'));
    }

    exist = async (id) => {
        let productos = await this.readProducts();
        return productos.find(prod => prod.id === id);
    }

    addProducts = async(producto) => {
        let productoOld = await this.readProducts();
        producto.id = nanoid(4);
        let productoAll = [...productoOld, producto];
        await this.writeProducts(productoAll);
        return "Producto Agregado exitosamente";
    }

    getProducts = async () => {
        return await this.readProducts();
    }

    getProductsById = async (id) => {
        let productosPorId = await this.exist(id);
        if(!productosPorId) return "Producto no encontrado";
        return productosPorId;
    };

    updateProducts = async (id, product) => {
        let productosPorId = await this.exist(id);
        if(!productosPorId) return "Producto no encontrado";
        await this.deleteProducts(id);
        let productoOld = await this.readProducts();
        let productos = [{...product, id : id}, ...productoOld];
        await this.writeProducts(productos);
        return "Producto actualizado";
    }

    deleteProducts = async (id) => {
        let productos = await this.readProducts();
        let existProductos = productos.some(prod => prod.id === id);
        if(existProductos) {
            let filtrarProductos = productos.filter(prod => prod.id != id);
            await this.writeProducts(filtrarProductos);
            return "Producto eliminado"
        }
        return "El Producto a eliminar no existe"

    }

}



