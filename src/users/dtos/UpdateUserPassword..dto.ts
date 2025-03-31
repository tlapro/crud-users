import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserPassword {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'La contraseña a cambiar.',
    example: 'Contraseña123@',
  })
  oldPassword: string;

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
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Debe coincidir con la contraseña',
    example: 'Contraseña123@',
  })
  confirmPassword: string;
}
