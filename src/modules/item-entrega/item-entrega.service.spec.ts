import { Test, TestingModule } from '@nestjs/testing';
import { ItemEntregaService } from './item-entrega.service';

describe('ItemEntregaService', () => {
  let service: ItemEntregaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemEntregaService],
    }).compile();

    service = module.get<ItemEntregaService>(ItemEntregaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
