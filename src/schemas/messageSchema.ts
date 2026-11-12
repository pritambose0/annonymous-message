import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, { message: "Message must be at least 3 characters." })
    .max(200, { message: "Message must be 200 characters or fewer." }),
});
