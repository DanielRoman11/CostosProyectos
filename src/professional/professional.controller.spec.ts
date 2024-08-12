import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProfessionalController } from './professional.controller';
import { ProfessionalService } from './professional.service';
import { Professional } from './entities/profesional.entity';
import { StaffService } from '../staff/staff.service';
import { StaffController } from '../staff/staff.controller';
import { Staff } from '../staff/entities/staff.entity';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { CreateProfessionalDto } from './dto/create-professional.dto';

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
      getMany: jest.fn().mockResolvedValue([] as Professional[]),
      getOneOrFail: jest.fn().mockResolvedValue({} as Professional),
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
        {
          id: 1,
          name: 'Test',
          staff_type: staff,
          unit_price: '10.51',
          profession: 'Test Profession',
        },
        {
          id: 2,
          name: 'Test2',
          staff_type: staff2,
          unit_price: '14.22',
          profession: 'Test Profession 2',
        },
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
      const professinal: Professional = {
        id: 1,
        name: 'Test',
        staff_type: staff,
        unit_price: '10.51',
        profession: 'Test Profession',
      };

      const result: Professional[] = [{ ...professinal }];

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

  describe('create a new Professional instance', () => {
    it('should create a new Professional instance', async () => {
      const staff: Staff = { id: 1, name: 'Test Staff' };

      const professionalDto: CreateProfessionalDto = {
        name: 'Test',
        profession: 'Test profession',
        staff_id: staff,
        unit_price: '12.0',
      };

      const result: Professional = {
        id: 1,
        ...professionalDto,
        staff_type: staff,
      };

      const spy = jest
        .spyOn(professionalService, 'createProfessional')
        .mockImplementation(async (input: CreateProfessionalDto) => result);

      expect(await professionalController.create(professionalDto)).toEqual(
        result,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update a professional instance', () => {
    it('should update a professional', async () => {
      const staff: Staff = { id: 1, name: 'TestStaff' };
      const professionalBefore: Professional = {
        id: 1,
        name: 'Test',
        profession: 'Test Profession',
        staff_type: staff,
        unit_price: '20.00',
      };

      const professionalDto: UpdateProfessionalDto = {
        name: 'New Name',
        staff_id: { id: staff.id } as Staff,
        profession: 'New Profession',
        unit_price: '15.02',
      };

      const result: Professional = {
        ...professionalBefore,
        ...professionalDto,
        staff_type: staff,
      };

      const spyUpdate = jest
        .spyOn(professionalService, 'updateProfessional')
        .mockResolvedValue(result);

      const updatedProfessional = await professionalController.update(
        professionalDto,
        { id: 1 },
      );

      expect(spyUpdate).toHaveBeenCalledTimes(1);
      expect(updatedProfessional).toEqual(result);
    });
  });
});
