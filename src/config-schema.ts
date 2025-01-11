import {z} from 'zod';


const headerSchema = z.object({
    key: z.string(),
    value: z.string(),
})

const upstreamsSchema = z.object({
    id:z.string(),
    url:z.string(),
})

const rulesSchema = z.object({
    path: z.string(),
    upstreams:z.array(z.string()),
})

const serverSchema = z.object({
  listen: z.number().int().positive(),
  workers: z.number().optional(),
  upstreams: z.array(upstreamsSchema),
  headers: z.array(headerSchema).optional(),
  rules: z.array(rulesSchema).optional(),
});

export const rootConfigSchema = z.object({server:serverSchema})

export type ConfigSchemaType = z.infer<typeof rootConfigSchema>;