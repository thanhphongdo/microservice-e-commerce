import { Controller } from '@nestjs/common';
import { AuthProto } from '@ecommerce/proto-contracts';
import { AppService } from './app.service';

@AuthProto.AuthServiceControllerMethods()
@Controller()
export class AppController implements AuthProto.AuthServiceController {
  constructor(private readonly appService: AppService) {}

  getStatus(_: AuthProto.Empty): AuthProto.StatusResponse {
    return this.appService.getStatus();
  }
}
