import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NullToUndefinedMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.body = this.transformNullToUndefined(req.body);
    next();
  }

  transformNullToUndefined(input: any): any {
    const transformed = { ...input };

    for (const key of Object.keys(transformed)) {
      if (transformed[key] === null) {
        transformed[key] = undefined;
      }
    }

    return transformed;
  }
}
