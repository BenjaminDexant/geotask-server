import { IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
