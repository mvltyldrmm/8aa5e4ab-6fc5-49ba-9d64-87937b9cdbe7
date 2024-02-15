import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ApiResponse, CustomError } from './api-response.model';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return this.sendResponse(
            response,
            HttpStatus.CONFLICT,
            exception.message,
          );
        case 'P2023':
          return this.sendResponse(
            response,
            HttpStatus.BAD_REQUEST,
            exception.message,
          );
        default:
          const parsedMessage =
            exception.message.split('\n').pop() || exception.message;
          return this.sendResponse(
            response,
            HttpStatus.INTERNAL_SERVER_ERROR,
            parsedMessage,
          );
      }
    }

    let message;
    if (exception instanceof HttpException) {
      message = exception.getResponse();
      if (typeof message === 'object' && message.hasOwnProperty('message')) {
        message = Array.isArray(message.message)
          ? message.message.join(', ')
          : message.message;
      } else {
        message = message;
      }
    } else if (exception instanceof Error) {
      message = this.parseErrorMessage(exception.message);
    } else {
      if (exception instanceof CustomError) {
        const message = exception.getResponse();
        return this.sendResponse(response, status, message);
      }
      message = 'Internal Server Error';
    }

    return this.sendResponse(response, status, message);
  }

  private sendResponse(response: Response, status: number, message: any): void {
    const apiResponse: ApiResponse<any> = {
      message: typeof message === 'string' ? message : JSON.stringify(message),
      error: true,
      data: {},
    };
    response.status(status).send(apiResponse);
  }

  private parseErrorMessage(rawMessage: string): string {
    const matches = rawMessage.match(/Argument .* expected \w+\./);
    return matches && matches[0] ? matches[0] : rawMessage;
  }
}
