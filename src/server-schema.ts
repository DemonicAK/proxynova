import {z} from 'zod';

export const WorkerMessageSchema = z.object({
    requestType: z.enum(['HTTP','HTTPS']),
    header: z.any().optional(),
    body: z.any(),
    url: z.string(),
})
export const WorkerMessageReplySchema = z.object({
    data: z.string().optional(),
    error: z.string().optional(),
    errorCode: z.enum(['404','500','400']).optional(),
})

export type WorkerMessageReplyType = z.infer<typeof WorkerMessageReplySchema>;
export type WorkerMessageType = z.infer<typeof WorkerMessageSchema>;