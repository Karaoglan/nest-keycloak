import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  Public,
  ResourceGuard,
  Roles,
  Unprotected,
} from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { TurnikeService } from './turnike.service';

export class BarcodeDto {
  uid: string;
  turnikeId: number;
  token: string;
}

@Controller('api')
@UseGuards(AuthGuard, ResourceGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly turnikeService: TurnikeService,
  ) {}

  @Post('/barcode')
  @Roles({ roles: ['app-user', 'app-admin'] })
  readBarcode(
    @Body() barcode: BarcodeDto,
    @Headers('Authorization') auth: string,
  ): string {
    barcode.token = auth;
    this.turnikeService.handleBarcodeRead(barcode);
    return 'Success';
  }

  @Get('')
  @Public(false)
  haha(): string {
    return this.appService.getHello();
  }

  @Get('/secured')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/login')
  login(): string {
    return this.appService.getHello();
  }

  @Get('/public')
  @Unprotected()
  publicE(): string {
    return 'UNPRO PUBLIC';
  }

  @Get('/user')
  @Roles({ roles: ['app-user'] })
  userE(): string {
    return 'userEnd';
  }

  @Get('/admin')
  @Roles({ roles: ['app-admin'] })
  adminE(): string {
    return this.appService.getHello();
  }
}
