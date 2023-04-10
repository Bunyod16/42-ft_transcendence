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

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      `Not Found : ${exception.message}` ||
      'Internal Server Error: Some bad shit happened';

    Logger.log(exception_obj.message, exception_obj.location);

    response.status(statusCode).json({
      statusCode,
      message: message,
    });
  }
}
