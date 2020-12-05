import { ValidationPipe } from '@nestjs/common';

export const ValidatePipe = new ValidationPipe({
  whitelist: true,
});
