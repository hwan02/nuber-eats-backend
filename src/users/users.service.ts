import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm'; 
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService
    ){}

    async createAccount({ email, password, role  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
        try {
          const exists = await this.users.findOne({ email });
          if (exists) {
            return { ok: false, error: 'There is a user with that email already' };
          }
          const user = await this.users.save(
            this.users.create({ email, password, role }),
          );
          // 현재 code가 없어서 에러가 난다. verification은 code가 필요하다.
          await this.verifications.save(
            this.verifications.create({
              user,
            }),
          );
          return { ok: true };
        } catch (e) {
          return { ok: false, error: "Couldn't create account" };
        }
      }

      async login({email, password}: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
        try{
          const user = await this.users.findOne({email}, {select: ['id','password']});
          if(!user){
            return{
              ok: false,
              error: "User not found",
            };
          }
          
          const passwordCorrect = await user.checkPassword(password);
          if(!passwordCorrect){
            return{
              ok: false,
              error: "Wrong password",
            };
          }
          const token = this.jwtService.sign(user.id);
          return {
            ok: true,
            token
          }
        }catch(error){
          return {ok: false, error}
        }
      }
      async findById(id: number): Promise<User> {
        return this.users.findOne({ id });
      }

      async editProfile(userId: number, {email, password}: EditProfileInput): Promise<User> {
        const user = await this.users.findOne(userId);
        if(email){
          user.email = email;
          user.verified = false;
          await this.verifications.save(this.verifications.create({ user }));
        }
        if(password){
          user.password = password
        }
        return this.users.save(user);
      }

      async verifyEmail(code: string): Promise<boolean> {
        try {
          const verification = await this.verifications.findOne(
            { code },
            { relations: ['user'] },
          );
          if (verification) {
            verification.user.verified = true;
            console.log(verification.user);
            this.users.save(verification.user);
            return true;
          }
          throw new Error();
        } catch (e) {
          console.log(e);
          return false;
        }
      }
}