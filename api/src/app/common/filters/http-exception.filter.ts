import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';
    this.logger.error(message);
    res.status(status).json({
      statusCode: status,
      error: status === 500 ? 'Internal Server Error' : (exception as any)?.name ?? 'Error',
      message: status === 500 ? 'Something went wrong' : message,
    });
  }
}
