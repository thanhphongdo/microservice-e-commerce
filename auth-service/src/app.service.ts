import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): { service: string; status: string } {
    return {
      service: 'auth-service',
      status: 'ok',
    };
  }
}
