import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { Professional } from './entities/profesional.entity';
import { StaffService } from '../staff/staff.service';
import { StaffController } from '../staff/staff.controller';
import { Staff } from '../staff/entities/staff.entity';

describe('Professional Controller', () => {
  let professionalController: ProfessionalController;
  let professionalService: ProfessionalService;
  let professionalRepo: Repository<Professional>;
  let staffService: StaffService;
  let selectQb: SelectQueryBuilder<Professional>;

  const staff: Staff = { id: 1, name: 'Test Staff' };
  const staff2: Staff = { id: 2, name: 'Test Staff 2' };

  beforeEach(async () => {
    selectQb = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getQuery: jest.fn().mockReturnValue('SELECT * FROM some_table'),
      getMany: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<SelectQueryBuilder<Professional>>;

    professionalRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(selectQb),
    } as unknown as Repository<Professional>;

    professionalRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(selectQb),
    } as unknown as Repository<Professional>;

    professionalService = new ProfessionalService(
      professionalRepo,
      staffService,
    );
    professionalController = new ProfessionalController(professionalService);
  });

  it('should be defined', () => {
    expect(StaffController).toBeDefined();
  });

  describe('find all professional without queries string', () => {
    it('should return an array of professionals', async () => {
      const result: Professional[] = [
        { id: 1, name: 'Test', staff_type: staff, unit_price: '10.51' },
        { id: 2, name: 'Test2', staff_type: staff2, unit_price: '14.22' },
      ];

      professionalService.findAll = jest.fn().mockImplementation(() => result);

      const spy = jest
        .spyOn(professionalService, 'findAll')
        .mockImplementation(async () => result);

      expect(await professionalController.findAll()).toEqual(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('find all professional with queries string', () => {
    it('should return an array of professionals', async () => {
      const result: Professional[] = [
        { id: 1, name: 'Test', staff_type: staff, unit_price: '10.51' },
      ];

      const spy = (professionalService.findByInput = jest
        .fn()
        .mockImplementation((name) => {
          return name ? result : [];
        }));

      expect(await professionalController.findAll({ name: 'test' })).toEqual(
        result,
      );
      expect(await professionalController.findAll()).not.toEqual(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});