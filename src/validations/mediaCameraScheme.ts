import { z } from 'zod';

export const mediaCameraScheme = z.object({
  date: z.string(),
  uri: z.string(),
  type: z.string(),
});
