import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    {
      // next.handle() is an Observable of the controller's result value
      return next.handle().pipe(
        tap((data) => {
          if (data === undefined || data === null)
            throw new NotFoundException();
        }),
      );
    }
  }
}
