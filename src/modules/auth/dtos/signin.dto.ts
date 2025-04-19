import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export class SignInDto extends createZodDto(signInSchema) {}
