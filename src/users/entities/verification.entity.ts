// 참고: typeorm.io/#/one-to-one-relations 
import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(type => String)
  code: string;

  // User가 삭제했을 때 어떻게 반응할지 정할 수 있다.
  @OneToOne(type => User, {onDelete: "CASCADE"})
  @JoinColumn()
  user: User;

  // 다른곳에서도 verification 생성할 수 있도록 하기 위함
  // npmjs.com/package/uuid
  // 다운로드 없이 코드 생성 방법: Math.random().toString(36).substring(2)
  // npm i uuid
  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}