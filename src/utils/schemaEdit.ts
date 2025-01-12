import { z } from 'zod';

const schemaEdit = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(2000, 'Description must be less than 2000 characters'),
  images: z
    .array(z.string(), { required_error: 'At least one image must be selected' })
    .min(1, 'At least one image must be selected'),
  public: z.boolean().optional(),
  userId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});


export default schemaEdit;