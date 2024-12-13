import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse = {
      statusCode: status,
      message: exception.message || 'Internal server error',
      error: exception.name || 'Error',
    };

    this.logger.error(
      `Status: ${status} - Message: ${exception.message}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}
