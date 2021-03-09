import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsesrsResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UsesrsResolver, UsersService]
})
export class UsersModule {}
