import { Repository } from 'typeorm';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { Staff } from './entities/staff.entity';
import { PickKeysByType } from 'typeorm/common/PickKeysByType';
import { UpdateStaffDto } from './dtos/update-staff.dto';

describe('StaffController', () => {
  let staffController: StaffController;
  let staffService: StaffService;
  let staffRepo: Repository<Staff>;

  beforeEach(async () => {
    staffService = new StaffService(staffRepo);
    staffController = new StaffController(staffService);
  });

  it('should be defined', () => {
    expect(staffController).toBeDefined();
  });

  describe('Find All Staff with no queries string', () => {
    it('should return an array of staff', async () => {
      const result: Staff[] = [];

      staffService.getAll = jest.fn().mockImplementation(() => result);

      const spy = jest
        .spyOn(staffService, 'getAll')
        .mockImplementation(async () => result);

      expect(await staffController.findAll({ name: '' })).toEqual(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find All Staff with queries string', () => {
    it('should return an array of staff matching the query name', async () => {
      const result: Staff[] = [{ id: 1, name: 'soyuntest' }];
      const emptyResult: Staff[] = [];

      const spy = jest
        .spyOn(staffService, 'findByInput')
        .mockImplementation(async (name: string) => {
          return name === 'test' ? result : emptyResult;
        });

      expect(await staffController.findAll({ name: 'test' })).toEqual(result);
      expect(await staffController.findAll({ name: 'hola' })).toEqual(
        emptyResult,
      );

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Find One Staff by id', () => {
    it('should return only one Staff object', async () => {
      const result: Staff = { id: 1, name: 'Test' };

      const spy = jest
        .spyOn(staffService, 'findOne')
        .mockImplementation(async (id: Pick<Staff, 'id'>) => result);

      expect(
        await staffController.findOne(<PickKeysByType<Staff, 'id'>>1),
      ).toEqual(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update Staff', () => {
    it('should update an staff object', async () => {
      const result: Staff = { id: 1, name: 'new name' };

      const spy = jest
        .spyOn(staffService, 'update')
        .mockImplementation(
          async (input: UpdateStaffDto, id: Pick<Staff, 'id'>) => result,
        );

      expect(
        await staffController.update(
          { name: 'New Name' },
          <PickKeysByType<Staff, 'id'>>1,
        ),
      ).toEqual(result);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
