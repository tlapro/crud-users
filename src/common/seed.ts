import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/users/entities/role.entity';

@Injectable()
export class SeedsService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.createDefaultRoles();
  }

  private async createDefaultRoles() {
    const roles = ['user', 'admin'];

    for (const roleName of roles) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: roleName },
      });

      if (!existingRole) {
        const role = this.rolesRepository.create({ name: roleName });
        await this.rolesRepository.save(role);
      }
    }
    console.log(`[Seeder] - Successfully created roles.`);
  }
}
