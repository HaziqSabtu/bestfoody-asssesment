import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      // ANSI color codes
      const reset = '\x1b[0m';
      const yellow = '\x1b[33m';
      const red = '\x1b[31m';
      const green = '\x1b[32m';

      let color = green; // default
      if (res.statusCode >= 500) color = red;
      else if (res.statusCode >= 400) color = yellow;

      const statusColored = `${color}${res.statusCode}${reset}`;
      const durationColored = `${color}+${duration}ms${reset}`;

      this.logger.log(
        `${req.method} ${req.originalUrl} - ${statusColored} ${durationColored}`,
      );
    });

    next();
  }
}
