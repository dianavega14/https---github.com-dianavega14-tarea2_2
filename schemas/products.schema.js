import { z } from 'zod'

const productSchema = z.object({
    id: z.number().int().positive().optional(),
    nombre: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    precio: z.number().positive("El precio debe ser mayor a 0"),
    stock: z.number().int().nonnegative("El stock no puede ser negativo"),
    categoria: z.string().max(50).optional(),
    fecha_creacion: z.union([z.string(), z.date()]).optional(),
}).strict();

const productSchemaDB = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    precio: z.number().positive("El precio debe ser mayor a 0"),
    stock: z.number().int().nonnegative("El stock no puede ser negativo"),
    categoria: z.string().max(50).optional(),
    fecha_creacion: z.union([z.string(), z.date()]).optional(),
}).strict();


export const validateProductSchema = (product) => productSchema.safeParse(product)

export const validatePartialSchema = (product) => productSchema.partial().safeParse(product)

export const validateProductSchemaDB = (product) => productSchemaDB.safeParse(product);

export const validatePartialProductSchemaDB = (product) => productSchemaDB.partial().safeParse(product);