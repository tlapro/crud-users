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
  name: string;

  @IsOptional()
  @IsDateString()
  birthdate: Date;

  @IsOptional()
  @IsNumberString()
  @MinLength(10, {
    message: 'El numero de teléfono debe contener al menos 10 caracteres.',
  })
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'El nombre de la ciudad debe contener al menos 3 caracteres.',
  })
  city: string;

  @IsOptional()
  @IsString()
  country: string;
}
