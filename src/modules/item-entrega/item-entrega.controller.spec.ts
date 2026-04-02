import { Test, TestingModule } from '@nestjs/testing';
import { ItemEntregaController } from './item-entrega.controller';

describe('ItemEntregaController', () => {
  let controller: ItemEntregaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemEntregaController],
    }).compile();

    controller = module.get<ItemEntregaController>(ItemEntregaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


