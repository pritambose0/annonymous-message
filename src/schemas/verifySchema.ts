import { z } from "zod";

export const verifySchema = z.object({
  username: z.string(),
  code: z.string().regex(/^\d{6}$/),
});
