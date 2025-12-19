import { mediaCameraScheme } from '@/validations/mediaCameraScheme';
import { z } from 'zod';

const solidWasteFormScheme = z.object({
  description: z
    .string()
    .min(3, { message: 'Debe tener al menos 3 caracteres' }),
  phone: z.string().min(9, { message: 'Teléfono no valido' }),
  incident: z.object({
    value: z.string(),
    label: z.string(),
    _index: z.number(),
  }),
  media: z
    .array(mediaCameraScheme)
    .min(1, { message: 'Debe contener al menos una imagen' }),
});

export type SolidWasteFormData = z.infer<typeof solidWasteFormScheme>;
export default solidWasteFormScheme;
