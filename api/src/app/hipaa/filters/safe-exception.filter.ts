// api/src/app/hipaa/filters/safe-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class SafeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SafeExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';

    // Log minimal details; never echo sensitive info back
    this.logger.error(message);

    res.status(status).json({
      statusCode: status,
      error: status === 500 ? 'Internal Server Error' : (exception as any)?.name ?? 'Error',
      message: status === 500 ? 'Something went wrong' : message,
    });
  }
}