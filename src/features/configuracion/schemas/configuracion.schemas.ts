import { z } from "zod";

export const parametroSchema = z.object({
  valor: z.string({ required_error: "El valor del parámetro es obligatorio" })
    .min(1, "El valor es obligatorio")
    .max(500, "El valor no puede superar los 500 caracteres"),
});
