import { z } from 'zod';
export const loginSchema = {
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(6)
  })
};
export const registerSchema = {
  body: z
    .object({
      username: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      address: z
        .object({
          street: z.string().min(1),
          city: z.string().min(1),
          state: z.string().min(1),
          zipcode: z.string().regex(/^\d{5}(-\d{4})?$/, {
            message: 'Invalid US zipcode format'
          })
        })
        .required()
    })
    .required()
};
