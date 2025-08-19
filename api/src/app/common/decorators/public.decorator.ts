// apps/api/src/app/authorization/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

// Flag used by JwtAuthGuard to bypass auth on public routes
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
