import { ProductsController } from "../controllers/productsController.js"
import { Router } from "express"

const productRouter = Router()

productRouter.get("/", ProductsController.getAllProducts)

productRouter.get("/:id", ProductsController.getProductById)

productRouter.post("/", ProductsController.createProduct)

productRouter.patch("/:id", ProductsController.updateProduct)

productRouter.delete("/:id", ProductsController.deleteProduct)

export default productRouter