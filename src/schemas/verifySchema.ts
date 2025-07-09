import { z } from "zod";

export const verifySchema = z
  .string()
  .length(6, "Verification code must be exactly 6 digits");
