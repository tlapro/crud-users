import {
  IsDateString,
  IsEmail,
  IsEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserAdminDto {
  @IsEmpty()
  id: string;

  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe contener al menos 3 caracteres.' })
  @ApiProperty({
    description: 'El nombre de usuario debe contener al menos 3 caracteres.',
    example: 'Juan Perez',
  })
  name: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'El email debe ser válido.',
    example: 'example@mail.com',
  })
  email: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: '2000-06-25',
  })
  birthdate: Date;

  @IsNumberString()
  @IsOptional()
  @MinLength(10, {
    message: 'El número de telefono debe contener al menos 10 caracteres.',
  })
  @ApiProperty({
    description: 'El número de teléfono debe tener al menos 10 caracteres.',
    example: '1511111111',
  })
  phone: string;

  @IsString()
  @IsOptional()
  @MinLength(3, {
    message: 'El nombre de la ciudad debe contener al menos 3 caracteres.',
  })
  @ApiProperty({
    description: 'Nombre de la ciudad. Debe contener al menos 3 caracteres.',
    example: 'Buenos Aires',
  })
  city: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'El nombre del país.',
    example: 'Argentina',
  })
  country: string;

  @IsOptional()
  @ApiProperty({
    description: 'Imágen de perfil del usuario',
    example: 'www.webexample.com',
  })
  imgUrl: string;

  @IsOptional()
  @ApiProperty({
    description: 'Rol del usuario. Solo puede ser "admin" o "user".',
    example: 'user',
  })
  roles: Role;
}
