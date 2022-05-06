import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { TurnikeGateway } from './turnike.gateway';
import { Cache } from 'cache-manager';
//import { GrantManager, Token } from 'keycloak-connect';
import { BarcodeDto } from './app.controller';

@Injectable()
export class TurnikeService {
  private readonly logger = new Logger(TurnikeService.name);

  constructor(
    private socketService: TurnikeGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) //private token: Token, //private kyc: GrantManager,
  {}

  handleBarcodeRead(barcode: BarcodeDto) {
    //this.kyc.userInfo(this.token).then(console.log);
    const msg = {
      id: barcode.uid,
      turnikeId: barcode.turnikeId,
      token: barcode.token,
    } as TurnikeOpenMessage;
    this.cacheManager.get(barcode.uid).then((turnId) => {
      if (barcode.turnikeId === turnId) {
        this.socketService.sendOpenDoor(JSON.stringify(msg));
      }
    });
  }
}

export type TurnikeOpenMessage = {
  id: string;
  turnikeId: number;
  token: string;
};
