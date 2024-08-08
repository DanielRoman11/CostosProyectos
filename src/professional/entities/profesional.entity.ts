import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Professional {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	profession: string

	@Column()
	price: number
}