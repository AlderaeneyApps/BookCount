import * as z from 'zod';

export interface Collection {
  id?: number;
  name?: string;
}

export const CollectionZod = z.object({
  id: z.number().nullable(),
  name: z.string(),
});
