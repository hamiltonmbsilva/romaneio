import { Test, TestingModule } from '@nestjs/testing';
import { RomaneioController } from './romaneio.controller';

describe('RomaneioController', () => {
  let controller: RomaneioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RomaneioController],
    }).compile();

    controller = module.get<RomaneioController>(RomaneioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
