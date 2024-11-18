import { z } from 'zod'

const cartSchema = z.object({
    id: z.number().int().positive().optional(),
    usuario_id: z.number().int().positive("El ID de usuario es obligatorio"),
    producto_id: z.number().int().positive("El ID de producto es obligatorio"),
    detalle_id: z.number().int().nullable().optional(),
    cantidad: z.number().int().positive("La cantidad debe ser mayor a 0").default(1),
    fecha_creacion: z.union([z.string(), z.date()]).optional(),
}).strict();

const cartSchemaDB = z.object({
    usuario_id: z.number().int().positive("El ID de usuario es obligatorio"),
    producto_id: z.number().int().positive("El ID de producto es obligatorio"),
    detalle_id: z.number().int().nullable().optional(),
    cantidad: z.number().int().positive("La cantidad debe ser mayor a 0").default(1),
    fecha_creacion: z.union([z.string(), z.date()]).optional(),
}).strict();

export const validateCartSchema = (cart) => cartSchema.safeParse(cart);

export const validatePartialCartSchema = (cart) => cartSchema.partial().safeParse(cart);

export const validateCartSchemaDB = (cart) => cartSchemaDB.safeParse(cart);

export const validatePartialCartSchemaDB = (cart) => cartSchemaDB.partial().safeParse(cart);
