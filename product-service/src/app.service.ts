import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): { service: string; status: string } {
    return {
      service: 'product-service',
      status: 'ok',
    };
  }
}
