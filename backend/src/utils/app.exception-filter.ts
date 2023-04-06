import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, status: HttpStatus, location?: string) {
    super({ message, location }, status);
  }
}

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exception_obj = exception.getResponse() as any;

    const statusCode = exception.getStatus();
    let message: string;
    switch (statusCode) {
      case 500:
        message = `Internal Server Error: `;
      case 404:
        message = `Not Found: `;
      case 400:
        message = `Bad Request: `;
    }
    message += `${exception.message}`;

    if (statusCode === 500)
      Logger.error(exception_obj.message, exception_obj.location);
    else Logger.log(exception_obj.message, exception_obj.location);

    response.status(statusCode).json({
      statusCode,
      message: message,
    });
  }
}
