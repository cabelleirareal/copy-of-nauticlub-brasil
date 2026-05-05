import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Boats E2E', () => {
  let app: INestApplication;
  let brokerToken: string;
  let ownerToken: string;
  let boatId: string;
  let brokerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();

    // Create broker user
    const brokerRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'broker-e2e@example.com',
        password: 'Test12345',
        name: 'E2E Broker',
        role: 'BROKER',
        brokerProfile: {
          cnpj: '12.345.678/0001-90',
          licenseNumber: 'CRECI-SP-12345',
        },
      });
    brokerToken = brokerRes.body.token;
    brokerId = brokerRes.body.id;

    // Create owner user
    const ownerRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'owner-e2e@example.com',
        password: 'Test12345',
        name: 'E2E Owner',
        role: 'OWNER',
      });
    ownerToken = ownerRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /boats (public)', () => {
    it('should list public boats', () => {
      return request(app.getHttpServer())
        .get('/boats')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body).toHaveProperty('pagination');
        });
    });
  });

  describe('POST /boats (authenticated)', () => {
    it('should create boat as broker', () => {
      return request(app.getHttpServer())
        .post('/boats')
        .set('Authorization', `Bearer ${brokerToken}`)
        .send({
          name: 'E2E Test Boat',
          brand: 'TestYacht',
          year: 2023,
          size: 45,
          price: 500000,
          type: 'Yacht',
          specs: {
            pax: 8,
            engine: 'Twin 600 HP',
          },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('E2E Test Boat');
          expect(res.body.listingBrokerId).toBe(brokerId);
          boatId = res.body.id;
        });
    });

    it('should reject unauthorized request', () => {
      return request(app.getHttpServer())
        .post('/boats')
        .send({
          name: 'Unauthorized Boat',
          brand: 'TestYacht',
          year: 2023,
          size: 45,
          price: 500000,
          type: 'Yacht',
          specs: { pax: 8, engine: 'Twin 600 HP' },
        })
        .expect(401);
    });
  });

  describe('GET /boats/:id (public)', () => {
    it('should get boat by id', () => {
      return request(app.getHttpServer())
        .get(`/boats/${boatId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(boatId);
          expect(res.body.viewCount).toBeGreaterThan(0);
        });
    });
  });

  describe('PATCH /boats/:id', () => {
    it('should update boat as listing broker', () => {
      return request(app.getHttpServer())
        .patch(`/boats/${boatId}`)
        .set('Authorization', `Bearer ${brokerToken}`)
        .send({
          featured: true,
          description: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.featured).toBe(true);
          expect(res.body.description).toBe('Updated description');
        });
    });

    it('should reject update from unauthorized user', () => {
      return request(app.getHttpServer())
        .patch(`/boats/${boatId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ featured: false })
        .expect(403);
    });
  });

  describe('DELETE /boats/:id', () => {
    it('should delete boat as listing broker', () => {
      return request(app.getHttpServer())
        .delete(`/boats/${boatId}`)
        .set('Authorization', `Bearer ${brokerToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.ok).toBe(true);
        });
    });
  });
});
