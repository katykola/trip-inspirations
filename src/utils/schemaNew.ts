import { z } from 'zod';

const schemaNew = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(2000, 'Description must be less than 2000 characters'),
  images: z
    .array(z.string(), { required_error: 'At least one image must be selected' })
    .min(1, 'At least one image must be selected'),
  public: z.boolean().optional(),
  userId: z.string().optional(),
  coordinates: z
    .object({
      lat: z.number({ invalid_type_error: 'Latitude is required' }),
      lng: z.number({ invalid_type_error: 'Longitude is required' }),
    }).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  url: z.string(),
});


export default schemaNew;