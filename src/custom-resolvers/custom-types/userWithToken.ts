import { ObjectType, Field } from 'type-graphql';
import { User } from '../../../prisma/generated/type-graphql';

@ObjectType()
class UserWithToken extends User {
  @Field()
  token: string;
}
export default UserWithToken;
