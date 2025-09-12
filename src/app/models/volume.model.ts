import * as z from 'zod';

export interface Volume {
  id?: number | null;
  volumeNumber?: number | null;
  price?: number | null;
  quantity?: number | null;
  seriesId?: number | null;
  pictures?: string[] | null;
  name?: string | null;
}

export const VolumeZod = z.object({
  id: z.number().nullable(),
  volumeNumber: z.number().nullable(),
  price: z.number().nullable(),
  quantity: z.number().nullable(),
  seriesId: z.number().nullable(),
  pictures: z.array(z.string()).nullable(),
  name: z.string().nullable(),
});
