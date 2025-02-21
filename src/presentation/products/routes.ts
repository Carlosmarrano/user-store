import { Router } from "express";
import { CategoryController } from "../category/controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category.service";
import { ProductController } from "./controller";
import { ProductService } from "../services/product.service";


export class ProductRoutes {

    static get routes(): Router{

        const router = Router();
        const productService = new ProductService();
        const controller = new ProductController(productService);

        //Definir Rutas
        router.get('/', controller.getProducts);
        router.post('/', [AuthMiddleware.validateJWT], controller.createProduct);

        return router;
    }
}