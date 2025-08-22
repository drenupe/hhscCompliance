// api/src/app/common/filters/http-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { appLogger } from '../logging/pino.logger';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<any>();
    const res = ctx.getResponse<any>();

    const requestId = req?.id || req?.headers?.['x-request-id'];
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.message ?? 'Error')
        : 'Internal server error';

    // Minimal, non-PHI log
    appLogger.error(
      {
        requestId,
        method: req?.method,
        url: req?.originalUrl || req?.url,
        status,
        err: { name: (exception as any)?.name, message },
      },
      'unhandled',
    );

    // Standardized error response without leaking details
    res.status(status).json({
      requestId,
      statusCode: status,
      message: status === 500 ? 'Internal server error' : message,
      timestamp: new Date().toISOString(),
      path: req?.originalUrl || req?.url,
    });
  }
}
