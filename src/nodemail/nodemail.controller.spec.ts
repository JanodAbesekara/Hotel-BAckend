import { Test, TestingModule } from '@nestjs/testing';
import { NodemailController } from './nodemail.controller';
import { NodemailService } from './nodemail.service';

describe('NodemailController', () => {
  let controller: NodemailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodemailController],
      providers: [NodemailService],
    }).compile();

    controller = module.get<NodemailController>(NodemailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
