import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcExceptions } from '../interfaces/RpcExceptions';

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const logger = new Logger('Execptions');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const rpcException = exception.getError() as RpcExceptions;

    const status = rpcException?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: rpcException?.message || 'internal server error',
    };

    logger.log(errorResponse);

    response.status(status).json(errorResponse);
  }
}
