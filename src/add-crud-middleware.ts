/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseMiddleware } from 'type-graphql';
import {
  ResolversEnhanceMap,
  User,
  Collection,
  Task,
} from '../prisma/generated/type-graphql';
import checkToken from './middlewares/checkToken';
import refreshToken from './middlewares/refreshToken';

const mapped: ResolversEnhanceMap = {
  User: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  Collection: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
  Task: {
    _all: [UseMiddleware(checkToken), UseMiddleware(refreshToken)],
  },
};

export default mapped;
