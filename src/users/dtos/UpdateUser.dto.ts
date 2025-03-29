import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe contener al menos 3 caracteres.' })
  @ApiProperty({
    description: 'El nombre de usuario debe contener al menos 3 caracteres.',
    example: 'Juan',
  })
  name: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    example: '2000-04-20',
  })
  birthdate: Date;

  @IsOptional()
  @IsNumberString()
  @MinLength(10, {
    message: 'El numero de teléfono debe contener al menos 10 caracteres.',
  })
  @ApiProperty({
    description: 'El número de teléfono debe tener al menos 10 caracteres.',
    example: '1511111111',
  })
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'El nombre de la ciudad debe contener al menos 3 caracteres.',
  })
  @ApiProperty({
    description: 'Nombre de la ciudad. Debe contener al menos 3 caracteres.',
    example: 'Buenos Aires',
  })
  city: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'El nombre del país.',
    example: 'Argentina',
  })
  country: string;
}
