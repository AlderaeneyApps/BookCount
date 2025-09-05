import * as z from 'zod';

export interface Series {
  id?: number | null;
  name?: string | null;
  price?: number | null;
  picture?: string | null;
  collectionId?: number | null;
}

export const SeriesZod = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  price: z.number().nullable(),
  picture: z.string().nullable(),
  collectionId: z.number().nullable(),
});
