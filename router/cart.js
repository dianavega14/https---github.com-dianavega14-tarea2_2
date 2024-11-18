import { CartController } from "../controllers/cartController.js"
import { Router } from "express"

const cartRouter = Router()

cartRouter.get("/:userId", CartController.getCartByUser)

cartRouter.post("/", CartController.addToCart)

cartRouter.delete("/:id", CartController.removeFromCart)

export default cartRouter