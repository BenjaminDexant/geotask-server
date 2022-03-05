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
    { email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await ctx.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    });

    return user;
  }
}

export default RegisterResolver;
