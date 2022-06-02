import { Length, IsEmail } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export default class RegisterInput {
  @Field()
  @Length(1, 255)
  firstname: string;

  @Field()
  @Length(1, 255)
  lastname: string;

  @Field()
  @IsEmail()
  // @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;

  @Field()
  password: string;
}
