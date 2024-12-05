import { Inject, Injectable } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import constants from './common/shared/constants';
import { ILike, Repository } from 'typeorm';
import { Project } from './projects/entities/project.entity';
import { Category } from './categories/entities/category.entity';
import { Staff } from './staff/entities/staff.entity';
import { Professional } from './professional/entities/profesional.entity';
import { Supply } from './supplies/entities/supply.entity';
import { ProfessionalCostDetails } from './professional/entities/professional-cost-detail.entity';
import { SupplyCostDetails } from './supplies/entities/supply-cost-detail.entity';
import { ProjectsService } from './projects/projects.service';
import { CategoriesService } from './categories/categories.service';
import { StaffService } from './staff/staff.service';
import { ProfessionalService } from './professional/professional.service';
import { SuppliesService } from './supplies/supplies.service';
import { CreateProjectDto } from './projects/dto/create-project.dto';
import { CreateStaffDto } from './staff/dto/create-staff.dto';
import { CreateCategoryDto } from './categories/dto/create-category.dto';
import { CreateSupplyDto } from './supplies/dto/create-supply.dto';
import { CreateProfessionalDto } from './professional/dto/create-professional.dto';
import { ItemQuantityDto } from './professional/dto/create-professional-item.dto';
import { ItemQuantityDto as CreateSupplyItemDto } from './supplies/dto/create-supply-item.dto';
import { CreateSupplyCostDetailDto } from './supplies/dto/create-supply-cost.dto';

@Injectable()
@Command({ name: 'db:seed', description: 'Seed test data into database' })
export class SeedService extends CommandRunner {
  constructor(
    @Inject(constants.project)
    private projectRepo: Repository<Project>,
    @Inject(constants.category)
    private categoryRepo: Repository<Category>,
    @Inject(constants.staff)
    private staffRepo: Repository<Staff>,
    @Inject(constants.professional)
    private professionalRepo: Repository<Professional>,
    @Inject(constants.supplies)
    private suppliesRepo: Repository<Supply>,
    @Inject(constants.professional_cost)
    private professionalCostRepo: Repository<ProfessionalCostDetails>,
    @Inject(constants.supplies_cost)
    private suppliesCostRepo: Repository<SupplyCostDetails>,

    private projectService: ProjectsService,
    private categoryService: CategoriesService,
    private staffService: StaffService,
    private professionalService: ProfessionalService,
    private suppliesService: SuppliesService,
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const staffs: CreateStaffDto[] = [
      {
        name: 'soldador',
      },
      {
        name: 'armador',
      },
      {
        name: 'ayudante',
      },
      {
        name: 'sst',
      },
    ];

    for await (let role of staffs) {
      await this.staffService.create(role);
    }
    console.log('✅ STAFFS CREATED SUCESSFULLY');

    const projects: CreateProjectDto[] = [
      {
        name: 'bogota',
        budget: '1500000.50',
      },
      {
        name: 'tunja',
        budget: '3200000.00',
      },
      {
        name: 'yopal',
        budget: '1800000.00',
      },
      {
        name: 'anapoima',
        budget: '2500000.00',
      },
      {
        name: 'madrid',
        budget: '4000000.00',
      },
      {
        name: 'chía',
        budget: '2200000.00',
      },
    ];
    const categories: CreateCategoryDto[] = [
      {
        name: 'consumibles',
      },
      {
        name: 'equipos',
      },
      {
        name: 'transporte',
      },
    ];
    const supplies: CreateSupplyDto[] = [
      //? "consumibles" - CATEGORY
      {
        name: 'SOLDADURA (Kg)',
        unit_price: '17820',
      },
      {
        name: 'DISCOS DE PULIR 7"X1/8"',
        unit_price: '7400',
      },
      {
        name: '"DISCO DE GRATA (8 JUNTAS)"',
        unit_price: '29000',
      },
      {
        name: '"KIT DE TINTAS (5 JUNTAS)"',
        unit_price: '295917.3',
      },
      {
        name: 'VIDRIO TRANSPARENTE',
        unit_price: '600',
      },
      {
        name: '"VIDRIO OSCURO (20 juntas)"',
        unit_price: '11000',
      },
      {
        name: 'COMBUSTIBLE Motosoldador (hr)',
        unit_price: '15820',
      },
      {
        name: 'COMBUSTIBLE Generador (hr)',
        unit_price: '15820',
      },
      //? "equipos" - CATEGORY
      {
        name: 'generador',
        unit_price: '60000',
      },
      {
        name: 'motosoldador',
        unit_price: '200000',
      },
      {
        name: 'pulidora',
        unit_price: '30000',
      },
      {
        name: 'extractor',
        unit_price: '60000',
      },
      {
        name: 'extensiones',
        unit_price: '10000',
      },
      {
        name: 'reflector',
        unit_price: '15000',
      },
      //? "transporte" - CATEGORY
      {
        name: 'Furgon (viaje)',
        unit_price: '100000',
      },
    ];
    const professionals: CreateProfessionalDto[] = [
      {
        name: 'Professional 1',
        unit_price: '17553.1914893617',
        staff_id: (
          await this.staffRepo.findOne({ where: { name: 'soldador' } })
        ).id,
      },
      {
        name: 'Professional 2',
        unit_price: '14605.0531914894',
        staff_id: (await this.staffRepo.findOne({ where: { name: 'armador' } }))
          .id,
      },
      {
        name: 'Professional 3',
        unit_price: '10849.4680851064',
        staff_id: (
          await this.staffRepo.findOne({ where: { name: 'ayudante' } })
        ).id,
      },
      {
        name: 'Professional 4',
        unit_price: '20864.3617021277',
        staff_id: (await this.staffRepo.findOne({ where: { name: 'sst' } })).id,
      },
    ];

    await Promise.all([
      (async () => {
        for await (let project of projects) {
          await this.projectService.create(project);
        }
      })(),
      (async () => {
        for await (let category of categories) {
          await this.categoryService.create(category);
        }
      })(),
      (async () => {
        for await (let supply of supplies) {
          await this.suppliesService.create(supply);
        }
      })(),
      (async () => {
        for await (let professional of professionals) {
          await this.professionalService.create(professional);
        }
      })(),
    ]);

    console.log(
      '✅ PROJECT, CATEGORIES, SUPPLIES AND PROFESSIONALS CREATED SUCESSFULLY',
    );

    let project = await this.projectRepo.findOne({
      where: { name: 'bogota' },
      relations: ['professionalCostDetails', 'supplyCostDetails'],
    });

    const professionals_instaces = await this.professionalService.findAll();

    await this.professionalService.createProfessionalCost(
      {
        unit: 'h',
        items: professionals_instaces.map((pro) => ({
          professional: pro,
          quantity: '9',
        })),
        description: 'Principales',
      },
      project.id,
    );
    console.log('ANTES DE LOS SUPPLIES');

    const supplies_cost_instances: CreateSupplyCostDetailDto[] = [
      {
        items: [
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%soldadura%') },
            }),
            quantity: '5',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%discos de pulir%') },
            }),
            quantity: '1',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%de grata%') },
            }),
            quantity: '0.125',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%kit de tintas%') },
            }),
            quantity: '0.20',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%transparente%') },
            }),
            quantity: '2',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%oscuro%') },
            }),
            quantity: '0.05',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%combustible motosoldador%') },
            }),
            quantity: '7',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%combustible generador%') },
            }),
            quantity: '7',
          },
        ],
        category_id: (
          await this.categoryRepo.findOne({
            where: { name: 'consumibles' },
          })
        ).id,
        unit: 'und',
      },
      {
        items: [
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: 'generador' },
            }),
            quantity: '1',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: 'motosoldador' },
            }),
            quantity: '1',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: 'pulidora' },
            }),
            quantity: '2',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: 'extractor' },
            }),
            quantity: '1',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: 'extensiones' },
            }),
            quantity: '2',
          },
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: 'reflector' },
            }),
            quantity: '1',
          },
        ],
        category_id: (
          await this.categoryRepo.findOne({
            where: { name: 'equipos' },
          })
        ).id,
        unit: 'und',
      },
      {
        items: [
          {
            supply: await this.suppliesRepo.findOne({
              where: { name: ILike('%furgon%') },
            }),
            quantity: '2',
          },
        ],
        category_id: (
          await this.categoryRepo.findOne({
            where: { name: 'transporte' },
          })
        ).id,
        unit: 'und',
      },
    ];

    for await (let supplie_instance of supplies_cost_instances) {
      await this.suppliesService.createSupplyCost(supplie_instance, project.id);
    }
    console.log('DESPUÉS DE LOS SUPPLIES');

    // await this.projectService.calculate_project_cost(project);
    console.log('✅ ALL COSTS INSTANCES CREATED');
    console.log(
      await this.projectRepo.findOne({
        where: { name: 'bogota' },
        relations: ['professionalCostDetails', 'supplyCostDetails'],
      }),
    );
    console.log('✅ ALL COSTS FOR PROJECT CREATED');

    process.exit(0);
  }
}
