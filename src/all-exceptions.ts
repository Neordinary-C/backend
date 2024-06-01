import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

type ResponseObject = {
  status: string;
  statusCode: number;
  reason?: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse: ResponseObject = {
      status: 'success',
      statusCode: 200,
    };

    if (exception instanceof HttpException) {
      exceptionResponse.status = 'error';
      exceptionResponse.statusCode = exception.getStatus();
      exceptionResponse.reason = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      exceptionResponse.status = 'error';
      exceptionResponse.statusCode = 422;
      exceptionResponse.reason = exception.message.replaceAll(/\n/g, '');
    } else {
      exceptionResponse.status = 'error';
      exceptionResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      exceptionResponse.reason = 'Internal Server Error';
    }

    response.status(exceptionResponse.statusCode).json(exceptionResponse);

    this.logger.error(exceptionResponse.reason, AllExceptionsFilter.name);

    super.catch(exception, host);
  }
}
