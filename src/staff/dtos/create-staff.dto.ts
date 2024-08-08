import { IsNotEmpty, Length } from "class-validator";

export class CreateStaffDto {
	@IsNotEmpty({message: 'El nombre no puede estar vacio'})
	@Length(3, 20, {message: 'El tamaño debe ser de 3 a 20 caracteres'})
	name: string
}