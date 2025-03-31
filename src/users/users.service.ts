/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { CloudinaryService } from 'src/common/cloudinary.service';
import { Rol } from 'src/common/roles.enum';
import { Role } from './entities/role.entity';
import { MailService } from 'src/common/mail.service';
import { UpdateUserAdminDto } from './dtos/UpdateUserAdmin.dto';
import { UpdateUserPassword } from './dtos/UpdateUserPassword..dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}
  getUsers() {
    try {
      return this.usersRepository.find({
        relations: ['roles'],
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ocurrió un error al obtener los usuarios.',
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: id },
        relations: ['roles'],
      });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ocurrió un error en la búsqueda del usuario.',
      );
    }
  }

  async getUserProfile(
    id: string,
  ): Promise<Omit<User, 'password' | 'roles' | 'isActive'>> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: id } });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      const {
        password: ignoredPassword,
        roles: ignoredRoles,
        isActive: ignoredisActive,
        ...userWithoutPassword
      } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ocurrió un error en el login.',
      );
    }
  }

  comparePassword(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  async signUp(user: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const userDb = await this.usersRepository.findOne({
        where: { email: user.email },
      });
      // Checking if user already exists
      if (userDb) {
        throw new BadRequestException('El email ya se encuentra registrado.');
      }
      // Password comparison
      if (!this.comparePassword(user.password, user.confirmPassword)) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }
      const role = await this.rolesRepository.findOne({
        where: { name: Rol.User },
      });
      if (!role) {
        throw new Error('Role not found');
      }
      // Hashing password
      const hashedPassword: string = await bcrypt.hash(user.password, 10);
      if (!hashedPassword) {
        throw new BadRequestException(
          'Se generó un error al encriptar la contraseña',
        );
      }
      // Change password > hashedPassword
      const newUser = this.usersRepository.create({
        ...user,
        password: hashedPassword,
        roles: role,
      });
      // Save user in database
      await queryRunner.manager.save(newUser);
      // await this.mailService.sendRegistrationEmail(newUser.email);
      await queryRunner.commitTransaction();
      // Return only userWithoutPassword
      const {
        password: ignoredPassword,
        confirmPassword: ignoredConfirmPassword,
        roles: ignoredRole,
        isActive: ignoredisActive,
        ...userWithoutPassword
      } = user;
      return {
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(credentials: LoginUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: credentials.email },
        relations: ['roles'],
      });

      if (!user) {
        throw new BadRequestException(
          'No existe una cuenta asociada a ese email.',
        );
      }
      if (!user.isActive) {
        throw new BadRequestException(
          'No existe una cuenta asociada a ese email.',
        );
      }

      const isValid = await bcrypt.compare(
        credentials.password,
        user?.password,
      );

      if (!isValid) {
        throw new BadRequestException('Usuario o contraseña incorrectos.');
      }
      const userPayload = {
        sub: user.id,
        id: user.id,
        email: user.email,
        role: user.roles.name,
      };
      const token = await this.jwtService.signAsync(userPayload);
      const {
        password: ignoredPassword,
        roles: ignoredRoles,
        isActive: ignoredisActive,
        ...userWithoutPassword
      } = user;

      return { message: 'Login exitoso', user: userWithoutPassword, token };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ocurrió un error en el login.',
      );
    }
  }

  async changePassword(
    userUpdatePassword: UpdateUserPassword,
    id: string,
  ): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, { where: { id } });

      if (!user) {
        throw new BadRequestException('No se encontró el usuario.');
      }
      if (user.id !== id) {
        throw new BadRequestException(
          'Ocurrió un error al actualizar la contraseña - Error de USER_ID',
        );
      }
      const isPasswordCorrect = await bcrypt.compare(
        userUpdatePassword.oldPassword,
        user.password,
      );
      if (!isPasswordCorrect) {
        throw new BadRequestException('La contraseña actual es incorrecta.');
      }
      const isPasswordValid = this.comparePassword(
        userUpdatePassword.newPassword,
        userUpdatePassword.confirmPassword,
      );
      if (
        userUpdatePassword.newPassword !== userUpdatePassword.confirmPassword
      ) {
        throw new BadRequestException(
          'La nueva contraseña y su confirmación no coinciden',
        );
      }
      const newPasswordHashed = await bcrypt.hash(
        userUpdatePassword.newPassword,
        10,
      );
      await queryRunner.manager.update(User, id, {
        password: newPasswordHashed,
      });

      await queryRunner.commitTransaction();
      return { message: 'Contraseña modificada con éxito.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        error.message || 'Ocurrió un error al cambiar la contraseña',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(userNewData: UpdateUserDto, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // Search user
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException(
          'No se encontro ningún usuario que actualizar.',
        );
      }
      const updatedUser = { ...user, ...userNewData };

      await queryRunner.manager.update(User, { id }, updatedUser);
      await queryRunner.commitTransaction();
      const {
        password: ignorePassword,
        roles: ignoredRoles,
        isActive: ignoredisActive,
        ...userWithoutPassword
      } = updatedUser;
      return {
        message: 'Datos actualizados con éxito',
        user: userWithoutPassword,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        error.message || 'Ocurrió un error al actualizar el usuario',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateAdmin(userNewData: UpdateUserAdminDto, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // Search user
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException(
          'No se encontro ningún usuario que actualizar.',
        );
      }
      const updatedUser = { ...user, ...userNewData };

      await queryRunner.manager.update(User, { id }, updatedUser);
      await queryRunner.commitTransaction();
      return {
        message: 'Datos actualizados con éxito',
        user: updatedUser,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        error.message || 'Ocurrió un error al actualizar el usuario',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUser(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user || !user.isActive) {
        throw new BadRequestException('Usuario no encontrado.');
      }

      const timestamp = Date.now();
      const readableDate = new Date(timestamp).toISOString();
      const newEmail = `${user.email}(/**deleted-${readableDate}**/)`;

      await queryRunner.manager.update(User, id, {
        isActive: false,
        email: newEmail,
      });
      await queryRunner.commitTransaction();
      return { message: 'Cuenta eliminada con éxito' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        error.message || 'Error al eliminar el usuario.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUserAdmin(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user || !user.isActive) {
        throw new BadRequestException(
          'Usuario no encontrado o la cuenta ya se encuentra eliminada.',
        );
      }
      const timestamp = Date.now();
      const readableDate = new Date(timestamp).toISOString();
      const newEmail = `${user.email}(/**deleted-${readableDate}**/)`;

      await queryRunner.manager.update(User, id, {
        isActive: false,
        email: newEmail,
      });
      await queryRunner.commitTransaction();
      return { message: 'Cuenta eliminada con éxito' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        error.message || 'Error al eliminar el usuario.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async activeUserAdmin(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }

      if (user.isActive) {
        throw new BadRequestException('La cuenta ya se encuentra activa.');
      }

      const oldEmail = user.email.split('(/**')[0];
      // `${user.email}-deleted-${Date.now()}`
      await queryRunner.manager.update(User, id, {
        isActive: true,
        email: oldEmail,
      });
      await queryRunner.commitTransaction();
      return { message: 'Cuenta activada con éxito' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        error.message || 'Error al activar el usuario.',
      );
    } finally {
      await queryRunner.release();
    }
  }
  async deleteDbUser(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado.');
      }

      await queryRunner.manager.delete(User, id);
      await queryRunner.commitTransaction();
      return { message: 'Cuenta eliminada de la base de datos con éxito' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        error.message || 'Error al eliminar de la base de datos al usuario.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async changeRol(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['roles'],
      });
      // Conditional to change rol
      const newRoleId = user?.roles?.name === 'user' ? '2' : '1';
      const newRole = await this.rolesRepository.findOne({
        where: { id: newRoleId },
      });
      if (!newRole) {
        throw new Error('Role not found');
      }
      await this.usersRepository.update(id, { roles: newRole });
      return { message: 'Rol modificado con éxito', newRole };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Ocurrió un error al actualizar el rol del usuario.',
      );
    }
  }

  async postImage(file: Express.Multer.File, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id } });

      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      // Upload image to cloudinary
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      if (!uploadedImage) {
        throw new BadRequestException(
          'Hubo un error al subir la imagen a la nube.',
        );
      }
      // Conditional message if user has already a profile picture
      const message =
        user.imgUser !== null
          ? 'Imagen actualizada correctamente'
          : 'Imagen subida correctamente';
      // Updating user in database
      await queryRunner.manager.update(User, id, {
        imgUser: uploadedImage.url,
      });
      await queryRunner.commitTransaction();
      // return object
      return { message, imgUrl: uploadedImage.url };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        error.message || 'Error al actualizar la imagen de usuario.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async putImage(id: string) {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      if (user.imgUser === 'https://i.imgur.com/fEtaWXr.png') {
        throw new BadRequestException(
          'No tienes una imagen de perfil que eliminar.',
        );
      }
      await this.usersRepository.update(id, {
        imgUser: 'https://i.imgur.com/fEtaWXr.png',
      });
      return { message: 'La imagen ha sido eliminada con éxito.' };
    } catch (error) {
      throw new BadRequestException(
        error.message || ' Ocurrió un error al eliminar la imagen',
      );
    }
  }
}
