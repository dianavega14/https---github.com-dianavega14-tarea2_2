import express from 'express'
import productRouter from './router/products.js'
import cartRouter from './router/cart.js'

const app = express()

app.disable('x-powered-by')
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/products', productRouter)
app.use('/cart', cartRouter)

app.use((req, res) => {
    res.status(404).json({
        message: "URL no encontrada"
    })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})                                                                      
