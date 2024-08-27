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
  ) {
    super();
  }
  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    const staffs = [
      this.staffRepo.create({
        name: 'soldador',
      }),
      this.staffRepo.create({
        name: 'armador',
      }),
      this.staffRepo.create({
        name: 'ayudante',
      }),
      this.staffRepo.create({
        name: 'sst',
      }),
    ];
    await this.staffRepo.save(staffs);
    console.log('✅ STAFFS CREATED SUCESSFULLY');

    const projects = [
      this.projectRepo.create({
        name: 'bogota',
        budget: '1500000.50',
      }),
      this.projectRepo.create({
        name: 'tunja',
        budget: '3200000.00',
        total_cost: '3200000.00',
        createdAt: '2023-09-15',
      }),
      this.projectRepo.create({
        name: 'yopal',
        budget: '1800000.00',
        total_cost: '1800000.00',
        createdAt: '2023-12-10',
      }),
      this.projectRepo.create({
        name: 'anapoima',
        budget: '2500000.00',
        total_cost: '2500000.00',
        createdAt: '2024-02-05',
      }),
      this.projectRepo.create({
        name: 'madrid',
        budget: '4000000.00',
        total_cost: '4000000.00',
        createdAt: '2024-04-15',
      }),
      this.projectRepo.create({
        name: 'chía',
        budget: '2200000.00',
        total_cost: '2200000.00',
        createdAt: '2024-06-20',
      }),
    ];

    const categories = [
      this.categoryRepo.create({
        name: 'consumibles',
      }),
      this.categoryRepo.create({
        name: 'equipos',
      }),
      this.categoryRepo.create({
        name: 'transporte',
      }),
    ];

    const supplies = [
      //? "consumibles" - CATEGORY
      this.suppliesRepo.create({
        name: 'SOLDADURA (Kg)',
        unit_price: '17820',
      }),
      this.suppliesRepo.create({
        name: 'DISCOS DE PULIR 7"X1/8"',
        unit_price: '7400',
      }),
      this.suppliesRepo.create({
        name: 'DISCOS DE PULIR 7"X1/8"',
        unit_price: '7400',
      }),
      this.suppliesRepo.create({
        name: '"DISCO DE GRATA (8 JUNTAS)"',
        unit_price: '29000',
      }),
      this.suppliesRepo.create({
        name: '"KIT DE TINTAS (5 JUNTAS)"',
        unit_price: '295917.3',
      }),
      this.suppliesRepo.create({
        name: 'VIDRIO TRANSPARENTE',
        unit_price: '600',
      }),
      this.suppliesRepo.create({
        name: '"VIDRIO OSCURO (20 juntas)"',
        unit_price: '11000',
      }),
      this.suppliesRepo.create({
        name: 'COMBUSTIBLE Motosoldador (hr)',
        unit_price: '15820',
      }),
      this.suppliesRepo.create({
        name: 'COMBUSTIBLE Generador (hr)',
        unit_price: '15820',
      }),
      //? "equipos" - CATEGORY
      this.suppliesRepo.create({
        name: 'generador',
        unit_price: '60000',
      }),
      this.suppliesRepo.create({
        name: 'motosoldador',
        unit_price: '200000',
      }),
      this.suppliesRepo.create({
        name: 'pulidora',
        unit_price: '30000',
      }),
      this.suppliesRepo.create({
        name: 'extractor',
        unit_price: '60000',
      }),
      this.suppliesRepo.create({
        name: 'extensiones',
        unit_price: '10000',
      }),
      this.suppliesRepo.create({
        name: 'reflector',
        unit_price: '15000',
      }),
      //? "transporte" - CATEGORY
      this.suppliesRepo.create({
        name: 'Furgon (viaje)',
        unit_price: '100000',
      }),
    ];

    const professionals = [
      this.professionalRepo.create({
        name: 'Professional 1',
        unit_price: '17553.1914893617',
        staff: {
          id: (await this.staffRepo.findOne({ where: { name: 'soldador' } }))
            .id,
        },
      }),
      this.professionalRepo.create({
        name: 'Professional 2',
        unit_price: '14605.0531914894',
        staff: {
          id: (await this.staffRepo.findOne({ where: { name: 'armador' } })).id,
        },
      }),
      this.professionalRepo.create({
        name: 'Professional 3',
        unit_price: '10849.4680851064',
        staff: {
          id: (await this.staffRepo.findOne({ where: { name: 'ayudante' } }))
            .id,
        },
      }),
      this.professionalRepo.create({
        name: 'Professional 4',
        unit_price: '20864.3617021277',
        staff: {
          id: (await this.staffRepo.findOne({ where: { name: 'sst' } })).id,
        },
      }),
    ];

    await Promise.all([
      this.projectRepo.save(projects),
      this.categoryRepo.save(categories),
      this.suppliesRepo.save(supplies),
      this.professionalRepo.save(professionals),
    ]);

    console.log(
      '✅ PROJECT, CATEGORIES, SUPPLIES AND PROFESSIONALS CREATED SUCESSFULLY',
    );

    const project = await this.projectRepo.findOne({
      where: { name: 'bogota' },
    });
    const professionals_instaces = await this.professionalRepo.find();
    try {
      const professionals_cost = this.professionalCostRepo.create({
        project: project,
        items: professionals_instaces.map((professional) => ({
          professional: professional,
          quantity: '9',
        })),
        unit: 'hrs',
        total_cost: '0',
      });

      const supplies_cost_instances = [
        this.suppliesCostRepo.create({
          project: {
            id: project.id,
          },
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
          category: {
            id: (
              await this.categoryRepo.findOne({
                where: { name: 'consumibles' },
              })
            ).id,
          },
          unit: 'und',
          total_cost: '0',
        }),
        this.suppliesCostRepo.create({
          project: {
            id: project.id,
          },
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
          category: await this.categoryRepo.findOne({
            where: { name: 'equipos' },
          }),
          unit: 'und',
          total_cost: '0',
        }),
        this.suppliesCostRepo.create({
          project: {
            id: project.id,
          },
          items: [
            {
              supply: await this.suppliesRepo.findOne({
                where: { name: ILike('%furgon%') },
              }),
              quantity: '2',
            },
          ],
          category: await this.categoryRepo.findOne({
            where: { name: 'transporte' },
          }),
          unit: 'und',
          total_cost: '0',
        }),
      ];

      project.professionalCostDetails = [
        await this.professionalCostRepo.save(professionals_cost),
      ];
      project.supplyCostDetails = await this.suppliesCostRepo.save(
        supplies_cost_instances,
      );
      console.log('✅ ALL COSTS INSTANCES CREATED');

      await Promise.all([
        ...project.professionalCostDetails.map(async (cost_details, i) => {
          const new_cost_details =
            this.projectService.calculate_professional_cost(cost_details);
          const saved_details =
            await this.professionalCostRepo.save(new_cost_details);
          project.professionalCostDetails[i] = saved_details;
        }),
        ...project.supplyCostDetails.map(async (cost_details, i) => {
          const new_cost_details =
            this.projectService.calculate_supply_cost(cost_details);
          const saved_details =
            await this.suppliesCostRepo.save(new_cost_details);
          project.supplyCostDetails[i] = saved_details;
        }),
      ]);

      const saved_project = await this.projectRepo.save(
        this.projectService.calculate_project_cost(project),
      );
      console.log('PROJECT TOTAL COST ', saved_project.total_cost);
      console.log('✅ ALL COSTS FOR PROJECT CREATED');

      process.exit(0);
    } catch (error) {
      throw new Error(error);
    }
  }
}
