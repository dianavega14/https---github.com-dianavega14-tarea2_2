import { validatePartialSchema, validateProductSchemaDB } from '../schemas/products.schema.js';
import connection from '../config/db.js'

export class ProductsController {
    static getAllProducts(req, res) {
        const consulta = "SELECT * FROM productos";

        connection.query(consulta, (error, results) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Ocurrió un error al obtener los datos: ${error.message}`
                });
            }

            return res.status(200).json(results);
        });
    }

    static getProductById(req, res) {
        const { id } = req.params;

        const consulta = "SELECT * FROM productos WHERE id = ?";
        connection.query(consulta, [id], (error, results) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Error al obtener el producto: ${error.message}`
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: "Producto no encontrado"
                });
            }

            return res.status(200).json(results[0]);
        });
    }

    static createProduct(req, res) {
        const query = `INSERT INTO productos (nombre, descripcion, precio, stock, categoria) 
                        VALUES (?, ?, ?, ?, ?)`;

        const data = req.body;
        const { success, error } = validateProductSchemaDB(data);

        if (!success) {
            return res.status(400).json({
                error: true,
                message: error.errors.map(err => err.message).join(', ')
            });
        }

        try {
            const { nombre, descripcion = null, precio, stock, categoria = null } = data;

            connection.query(query, [nombre, descripcion, precio, stock, categoria], (error, results) => {
                if (error) {
                    return res.status(500).json({
                        error: true,
                        message: `Error al crear el producto: ${error.message}`
                    });
                }

                res.status(201).json({
                    id: results.insertId,
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    categoria
                });
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: `Error al procesar la solicitud: ${error.message}`
            });
        }
    }

    static updateProduct(req, res) {
        const { id } = req.params;
        const data = req.body;

        const { success, error } = validatePartialSchema(data);

        if (!success) {
            return res.status(400).json({
                error: true,
                message: error.errors.map(err => err.message).join(', ')
            });
        }

        try {
            const consulta = "UPDATE productos SET ? WHERE id = ?";

            connection.query(consulta, [data, id], (error, results) => {
                if (error) {
                    return res.status(500).json({
                        error: true,
                        message: `Error al actualizar el producto: ${error.message}`
                    });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        error: true,
                        message: "Producto no encontrado"
                    });
                }

                res.status(200).json({
                    message: "Producto actualizado correctamente",
                    updatedProduct: { id, ...data }
                });
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: `Error al procesar la solicitud: ${error.message}`
            });
        }
    }

    static deleteProduct(req, res) {
        const { id } = req.params;

        const consulta = "DELETE FROM productos WHERE id = ?";
        connection.query(consulta, [id], (error, results) => {
            if (error) {
                return res.status(500).json({
                    error: true,
                    message: `Error al eliminar el producto: ${error.message}`
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    error: true,
                    message: "Producto no encontrado"
                });
            }

            res.status(200).json({
                message: "Se eliminó el producto"
            });
        });
    }
}
