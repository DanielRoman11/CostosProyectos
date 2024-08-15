import { Test } from '@nestjs/testing';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { Professional } from './entities/profesional.entity';
import { Staff } from '../staff/entities/staff.entity';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

describe('ProfessionalController', () => {
  let controller: ProfessionalController;
  let service: ProfessionalService;
  let staff: Staff;

  beforeAll(() => {
    staff = {
      id: 1,
      name: 'Test Staff',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProfessionalController],
      providers: [
        {
          provide: ProfessionalService,
          useValue: {
            createProfessional: jest.fn(),
            findByInput: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateProfessional: jest.fn(),
            deleteProfessional: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfessionalService>(ProfessionalService);
    controller = module.get<ProfessionalController>(ProfessionalController);
  });

  it('ProfessionalController should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a Professional instance', async () => {
      const professionalDto: CreateProfessionalDto = {
        name: 'Test Name',
        profession: 'Test Profession',
        staff_id: staff,
        unit_price: '10.20',
      };

      const result: Professional = {
        ...professionalDto,
        staff_id: staff,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'createProfessional')
        .mockImplementation(async () => result);

      expect(await controller.create(professionalDto)).toBe(result);
      expect(service.createProfessional).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of professionals when no query is provided', async () => {
      const result: Professional[] = [
        {
          id: 1,
          name: 'Test Name',
          profession: 'Test Profession',
          staff_id: staff,
          unit_price: '10.22',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAll with query', () => {
    it('should return an array of professionals filtered by name', async () => {
      const input = { name: 'Test name' };
      const result: Professional[] = [
        {
          id: 1,
          name: 'Test Name',
          profession: 'Test Profession',
          staff_id: staff,
          unit_price: '10.22',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'findByInput').mockImplementation(async () => result);

      expect(await controller.findAll(input)).toBe(result);
      expect(service.findByInput).toHaveBeenCalled();
    });
  });

  describe('findProfessional', () => {
    it('should return a Professional by id', async () => {
      const result: Professional = {
        id: 1,
        name: 'Test Name',
        profession: 'Test Profession',
        staff_id: staff,
        unit_price: '10.20',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findProfessional({ id: 1 })).toBe(result);
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a Professional instance', async () => {
      const professionalDto: UpdateProfessionalDto = {
        name: 'Test Name',
        profession: 'Test Profession',
        staff_id: staff,
        unit_price: '10.20',
      };

      const result: Professional = {
        id: 1,
        name: 'Test Name',
        profession: 'Test Profession',
        staff_id: staff,
        unit_price: '10.20',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'updateProfessional')
        .mockImplementation(async () => result);

      expect(await controller.update(professionalDto, { id: 1 })).toBe(result);
      expect(service.updateProfessional).toHaveBeenCalled();
    });
  });

  describe('deleteProfessional', () => {
    it('should delete a Professional from the database', async () => {
      const spy = jest
        .spyOn(service, 'deleteProfessional')
        .mockResolvedValue(undefined);

      await controller.delete({ id: 1 });

      expect(spy).toHaveBeenCalled();
    });
  });
});
