import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as request from 'supertest';
import { App } from 'supertest/types';
import TestAgent from 'supertest/lib/agent';
import { v4 as uuidv4 } from 'uuid';

import { PlayersQueueRequest } from '@/players/dto/players-queue.request';
import { PlayersDequeueRequest } from '@/players/dto/players-dequeue.request';
import { AppModule } from '../src/app.module';

describe('PlayersController (e2e)', () => {
  let app: INestApplication<App>;

  let agent: InstanceType<typeof TestAgent>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    agent = request.agent(app.getHttpServer());

    await app.init();
  }, 15000);

  afterAll(async () => {
    await app.close();
  });

  describe('/players (POST)', () => {
    it('/queue', async () => {
      const body1: PlayersQueueRequest = {
        dungeons: ['Deadmines'],
        players: [
          {
            id: uuidv4(),
            level: 20,
            roles: ['Tank'],
          },
          {
            id: uuidv4(),
            level: 20,
            roles: ['Damage'],
          },
        ],
      };

      await agent.post('/players/queue').send(body1).expect(201);

      const body2: PlayersQueueRequest = {
        dungeons: ['Deadmines'],
        players: [
          {
            id: uuidv4(),
            level: 20,
            roles: ['Healer'],
          },
          {
            id: uuidv4(),
            level: 20,
            roles: ['Damage'],
          },
          {
            id: uuidv4(),
            level: 20,
            roles: ['Damage'],
          },
        ],
      };

      await agent.post('/players/queue').send(body2).expect(201);
    });

    it('/dequeue', async () => {
      const body1: PlayersDequeueRequest = {
        playerIds: [uuidv4(), uuidv4()],
      };

      await agent.post('/players/dequeue').send(body1).expect(204);

      const body2: PlayersDequeueRequest = {
        playerIds: [uuidv4(), uuidv4()],
      };

      await agent.post('/players/dequeue').send(body2).expect(204);
    });
  });
});
