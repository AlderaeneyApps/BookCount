import * as z from 'zod';

export interface Series {
  id?: number | null;
  name?: string | null;
  pictures?: string[] | null;
  collectionId?: number | null;
}

export const SeriesZod = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  pictures: z.array(z.string()).nullable(),
  collectionId: z.number().nullable(),
});
