import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TurnikeGateway } from './turnike.gateway';
import ShortUniqueId from 'short-unique-id';
import { Cache } from 'cache-manager';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private socketService: TurnikeGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  handleCron() {
    this.getData().then(console.log);
    this.logger.debug('Called when the current second is 45');
    const uid = new ShortUniqueId({ length: 10 });
    const msg = {
      id: uid(),
      turnikeId: 1,
    } as TurnikeMessage;
    this.socketService.sendMessage(JSON.stringify(msg));
    this.appendToCache(msg);
  }

  private appendToCache = async (msg: TurnikeMessage) => {
    await this.cacheManager.set(msg.id.toString(), msg.turnikeId, {
      ttl: 2000,
    });
  };

  private async getData() {
    //Get all keys
    const keys = await this.cacheManager.store.keys();

    //Loop through keys and get data
    const allData: { [key: string]: any } = {};
    for (const key of keys) {
      allData[key] = await this.cacheManager.get(key);
    }
    return allData;
  }
}

export type TurnikeMessage = {
  id: ShortUniqueId;
  turnikeId: number;
};
