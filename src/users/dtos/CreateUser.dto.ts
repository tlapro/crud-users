import {
  IsDateString,
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre debe contener al menos 3 caracteres.' })
  @ApiProperty({
    description: 'El nombre de usuario debe contener al menos 3 caracteres.',
    example: 'Juan',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'El email debe ser válido.',
    example: 'example@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)',
  })
  @ApiProperty({
    description:
      'La contraseña debe tener al menos 6 caracteres y contener una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)',
    example: 'Contraseña123@',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Debe coincidir con la contraseña',
    example: 'Contraseña123@',
  })
  confirmPassword: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: '2000-04-20',
  })
  birthdate: Date;

  @IsNumberString()
  @IsNotEmpty()
  @MinLength(10, {
    message: 'El número de telefono debe contener al menos 10 caracteres.',
  })
  @ApiProperty({
    description: 'El número de teléfono debe tener al menos 10 caracteres.',
    example: '1511111111',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'El nombre de la ciudad debe contener al menos 3 caracteres.',
  })
  @ApiProperty({
    description: 'Nombre de la ciudad. Debe contener al menos 3 caracteres.',
    example: 'Buenos Aires',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'El nombre del país.',
    example: 'Argentina',
  })
  country: string;

  @IsEmpty()
  @ApiProperty({
    description: 'Imágen de perfil, no debe enviarse al crear el usuario.',
  })
  imgUser: string;

  @IsEmpty()
  @ApiProperty({
    description: 'Rol del usuario, no debe enviarse al crearlo.',
  })
  roles: Role;

  @IsEmpty()
  @ApiProperty({
    description: 'Estado de la cuenta, no debe enviarse al crearlo.',
  })
  isActive: boolean;
}
