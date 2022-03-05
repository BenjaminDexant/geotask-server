import { PrismaClient } from '@prisma/client';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../prisma/generated/type-graphql';

import RegisterInput from './input-validators/RegisterInput';

@Resolver()
class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Ctx() ctx: { prisma: PrismaClient },
    @Arg('data', () => RegisterInput)
    { email, firstname, lastname, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await ctx.prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return user;
  }
}

export default RegisterResolver;
