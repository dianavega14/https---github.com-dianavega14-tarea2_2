import { validateCartSchemaDB } from "../schemas/cart.schema.js";
import connection from '../config/db.js';

export class CartController {
    static getCartByUser(req, res) {
        const { userId } = req.params;
        const query = `
            SELECT 
                c.id AS cartId, 
                p.id AS productId, 
                p.nombre AS productName, 
                p.precio AS productPrice, 
                c.cantidad AS quantity, 
                c.fecha_agregado AS addedDate
            FROM carrito c
            INNER JOIN productos p ON c.producto_id = p.id
            WHERE c.usuario_id = ?
        `;

        connection.query(query, [userId], (error, results) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Error al obtener el carrito del usuario: ${error.message}`
                });
            }

            res.status(200).json(results);
        });
    }

    static addToCart(req, res) {
        const { userId, productId, quantity } = req.body;

        const stockCheckQuery = `
            SELECT stock FROM productos WHERE id = ?
        `;

        connection.query(stockCheckQuery, [productId], (error, results) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Error al verificar el stock del producto: ${error.message}`
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'Producto no encontrado'
                });
            }

            const stock = results[0].stock;

            if (stock < quantity) {
                return res.status(400).json({
                    error: true,
                    message: 'No hay suficiente stock disponible para este producto'
                });
            }

            const checkQuery = `
                SELECT * FROM carrito 
                WHERE usuario_id = ? AND producto_id = ?
            `;

            connection.query(checkQuery, [userId, productId], (error, results) => {
                if (error) {
                    return res.status(500).json({
                        error: true,
                        message: `Error al verificar el producto en el carrito: ${error.message}`
                    });
                }

                if (results.length > 0) {
                    const updateQuery = `
                        UPDATE carrito 
                        SET cantidad = cantidad + ? 
                        WHERE usuario_id = ? AND producto_id = ?
                    `;

                    connection.query(updateQuery, [quantity, userId, productId], (error) => {
                        if (error) {
                            return res.status(500).json({
                                error: true,
                                message: `Error al actualizar el producto en el carrito: ${error.message}`
                            });
                        }

                        res.status(200).json({
                            message: 'Cantidad del producto actualizada en el carrito'
                        });
                    });
                } else {
                    const insertQuery = `
                        INSERT INTO carrito (usuario_id, producto_id, cantidad) 
                        VALUES (?, ?, ?)
                    `;

                    connection.query(insertQuery, [userId, productId, quantity], (error) => {
                        if (error) {
                            return res.status(500).json({
                                error: true,
                                message: `Error al agregar el producto al carrito: ${error.message}`
                            });
                        }

                        res.status(201).json({
                            message: 'Producto agregado al carrito'
                        });
                    });
                }
            });
        });
    }


    static removeFromCart(req, res) {
        const { id } = req.params;
        const query = `
            DELETE FROM carrito 
            WHERE id = ?
        `;

        connection.query(query, [id], (error) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Error al eliminar el producto del carrito: ${error.message}`
                });
            }

            res.status(200).json({
                message: 'Producto eliminado del carrito'
            });
        });
    }
}
