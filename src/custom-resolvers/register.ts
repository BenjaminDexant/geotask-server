import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../prisma/generated/type-graphql';

import RegisterInput from './input-validators/RegisterInput';

import { Context } from '../context';

@Resolver()
class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Ctx() ctx: Context,
    @Arg('data', () => RegisterInput)
    { firstname, lastname, email, password }: RegisterInput
  ): Promise<User> {
    const user = await ctx.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await ctx.prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: 'USER',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    });

    return newUser;
  }
}

export default RegisterResolver;
