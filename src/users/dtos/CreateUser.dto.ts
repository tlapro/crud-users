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

export class CreateUserDto {
  @IsEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre debe contener al menos 3 caracteres.' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate: Date;

  @IsNumberString()
  @IsNotEmpty()
  @MinLength(10, { message: 'El nombre debe contener al menos 10 caracteres.' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'El nombre de la ciudad debe contener al menos 3 caracteres.',
  })
  city: string;

  @IsEmpty()
  imgUrl: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsEmpty()
  roles: Role;

  @IsEmpty()
  isActive: boolean;
}
