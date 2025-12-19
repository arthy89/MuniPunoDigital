import { mediaCameraScheme } from '@/validations/mediaCameraScheme';
import { z } from 'zod';

export type MediaCamera = z.infer<typeof mediaCameraScheme>;
export type MediaType = 'photo' | 'video' | 'mixed';
