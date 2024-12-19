import { z } from 'zod';

const tripNewSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  url: z.string()
    .optional()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
    message: 'Invalid URL'
    }),
  images: z.array(z.string()).optional(),
  coordinates: z.object({
    lat: z.number().refine((val) => !isNaN(val), {
      message: 'Latitude is required',
    }),
    lng: z.number().refine((val) => !isNaN(val), {
      message: 'Longitude is required',
    }),
  }),
});

export default tripNewSchema;