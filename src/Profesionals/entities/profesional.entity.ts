import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profesional {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	profesion: string

	@Column()
	price: number
}