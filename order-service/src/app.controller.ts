import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('OrderService', 'GetStatus')
  getStatus(): { service: string; status: string } {
    return this.appService.getStatus();
  }
}
