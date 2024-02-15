export class ApiResponse<T> {
  message: string;
  data?: T;
  error?: any;
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomError extends HttpException {
  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ message, error: true }, statusCode);
  }
}
