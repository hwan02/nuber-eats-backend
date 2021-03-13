import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from './entities/user.entity';
import { UsesrsResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UsesrsResolver, UsersService],
    exports: [UsersService]
})
export class UsersModule {}
