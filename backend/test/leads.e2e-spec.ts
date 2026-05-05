import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Leads E2E', () => {
  let app: INestApplication;
  let brokerToken: string;
  let boatId: string;
  let leadId: string;
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
        email: 'leads-broker@example.com',
        password: 'Test12345',
        name: 'Leads Broker',
        role: 'BROKER',
        brokerProfile: {
          cnpj: '12.345.678/0001-90',
          licenseNumber: 'CRECI-SP-12345',
        },
      });
    brokerToken = brokerRes.body.token;
    brokerId = brokerRes.body.id;

    // Create test boat
    const boatRes = await request(app.getHttpServer())
      .post('/boats')
      .set('Authorization', `Bearer ${brokerToken}`)
      .send({
        name: 'Leads Test Boat',
        brand: 'TestYacht',
        year: 2023,
        size: 40,
        price: 400000,
        type: 'Yacht',
        specs: {
          pax: 8,
          engine: 'Twin 600 HP',
        },
      });
    boatId = boatRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /leads (public)', () => {
    it('should capture lead without authentication', () => {
      return request(app.getHttpServer())
        .post('/leads')
        .send({
          boatId,
          name: 'John Interested',
          email: 'john@example.com',
          phone: '+5511987654321',
          message: 'I am interested in this boat',
          type: 'INTEREST',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('John Interested');
          expect(res.body.assignedBrokerId).toBe(brokerId);
          expect(res.body.source).toBe('LISTING_BROKER');
          leadId = res.body.id;
        });
    });

    it('should capture organic lead without boat', () => {
      return request(app.getHttpServer())
        .post('/leads')
        .send({
          name: 'Jane Buyer',
          email: 'jane@example.com',
          phone: '+5511998765432',
          message: 'Looking for a boat',
          type: 'INTEREST',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.source).toBe('ORGANIC');
          expect(res.body.assignedBrokerId).toBeNull();
        });
    });
  });

  describe('GET /leads (authenticated)', () => {
    it('should list leads for broker', () => {
      return request(app.getHttpServer())
        .get('/leads')
        .set('Authorization', `Bearer ${brokerToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body).toHaveProperty('pagination');
          const hasTestLead = res.body.data.some(
            (lead: any) => lead.id === leadId
          );
          expect(hasTestLead).toBe(true);
        });
    });

    it('should reject unauthorized request', () => {
      return request(app.getHttpServer())
        .get('/leads')
        .expect(401);
    });
  });

  describe('PATCH /leads/:id', () => {
    it('should update lead status as assigned broker', () => {
      return request(app.getHttpServer())
        .patch(`/leads/${leadId}`)
        .set('Authorization', `Bearer ${brokerToken}`)
        .send({
          status: 'CONTACTED',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('CONTACTED');
        });
    });

    it('should update lead status', () => {
      return request(app.getHttpServer())
        .patch(`/leads/${leadId}`)
        .set('Authorization', `Bearer ${brokerToken}`)
        .send({
          status: 'QUALIFIED',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('QUALIFIED');
        });
    });
  });
});
