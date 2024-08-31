import { Test, TestingModule } from '@nestjs/testing';
import { NodemailService } from './nodemail.service';

describe('NodemailService', () => {
  let service: NodemailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NodemailService],
    }).compile();

    service = module.get<NodemailService>(NodemailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
