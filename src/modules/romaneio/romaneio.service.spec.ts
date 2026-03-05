import { Test, TestingModule } from '@nestjs/testing';
import { RomaneioService } from './romaneio.service';

describe('RomaneioService', () => {
  let service: RomaneioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RomaneioService],
    }).compile();

    service = module.get<RomaneioService>(RomaneioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
