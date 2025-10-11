import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().regex(/^\d{6}$/),
});
