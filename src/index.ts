import 'reflect-metadata';
import * as tq from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { context } from './context';

import register from './custom-resolvers/register';
import login from './custom-resolvers/login';
import logout from './custom-resolvers/logout';
import users from './custom-resolvers/users';

import {
  applyResolversEnhanceMap,
  resolvers,
} from '../prisma/generated/type-graphql';

import mapped from './add-crud-middleware';

const MyServer = async () => {
  // Initialize Express and HTTP server
  const app = express();
  app.use(cookieParser());
  // add cors in .env file
  app.use(
    cors({
      credentials: true,
      origin: [
        'https://studio.apollographql.com', // playground Apollo GraphQL /!\ only in developpenment
        'http://localhost:5000/graphql', // localhost:5050
        'http://localhost:3000', // app React for développement
        'http://localhost:19006', // mobile app for développement
      ],
    })
  );

  const httpServer = http.createServer(app);

  applyResolversEnhanceMap(mapped);

  // Build GraphQL schema from TS entities and resolvers
  const schema = await tq.buildSchema({
    resolvers: [...resolvers, register, login, logout, users],
    emitSchemaFile: true,
  });

  // Create Apollo server
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      prisma: context.prisma,
      req,
      res,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Start Apollo server
  await server.start();

  // "Hook" Express app with Apollo server
  server.applyMiddleware({ app, cors: false });

  // Start HTTP server
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(
    `🚀 Server ready at: http://localhost:4000\n⭐️ See sample queries: http://pris.ly/e/ts/graphql-typegraphql-crud#using-the-graphql-api`
  );
};

MyServer();
