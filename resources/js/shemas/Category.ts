import { z } from "zod";

export const categoryShema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
});

export type Category = z.infer<typeof categoryShema>;
