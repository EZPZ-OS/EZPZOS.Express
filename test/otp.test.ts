// File: tests/otp.test.ts
import request from 'supertest';
import express, { Express } from 'express';
import otpRouter from '../src/routes/otp';
import * as dotenv from 'dotenv';
import twilio from 'twilio';
import { ConnectionPool } from 'mssql';

// Load environment variables
dotenv.config();

// Mock Twilio
jest.mock('twilio');

// Mock Database Connection
jest.mock('mssql', () => {
  const mssql = jest.requireActual('mssql');
  return {
    ...mssql,
    ConnectionPool: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(null),
      request: jest.fn().mockReturnValue({
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] }),
      }),
    })),
  };
});

// Create Express app
const app: Express = express();
app.use(express.json());
app.use('/otp', otpRouter);

describe('OTP Endpoints', () => {
  let twilioClientMock: any;

  beforeAll(() => {
    // Mock Twilio Client
    twilioClientMock = {
      verify: {
        v2: {
          services: jest.fn().mockReturnThis(),
          verifications: {
            create: jest.fn().mockResolvedValue({}),
          },
          verificationChecks: {
            create: jest.fn().mockResolvedValue({ status: 'approved' }),
          },
        },
      },
    };

    (twilio as jest.Mock).mockImplementation(() => twilioClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send OTP successfully', async () => {
    const res = await request(app)
      .post('/otp/send-otp')
      .send({ mobile: '+61473001475' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('OTP sent successfully');
    expect(twilioClientMock.verify.v2.services().verifications.create).toHaveBeenCalledWith({
      to: '+61473001475',
      channel: 'sms',
    });
  });

  it('should verify OTP successfully', async () => {
    const res = await request(app)
      .post('/otp/verify-otp')
      .send({ mobile: '+61473001475', otp: '123456' });

    expect(res.status).toBe(200);
    expect(res.text).toContain('OTP verified successfully');
    expect(twilioClientMock.verify.v2.services().verificationChecks.create).toHaveBeenCalledWith({
      to: '+61473001475',
      code: '123456',
    });
  });

  it('should fail to verify OTP with wrong code', async () => {
    // Mock the verification check to fail
    twilioClientMock.verify.v2.services().verificationChecks.create.mockResolvedValueOnce({
      status: 'pending',
    });

    const res = await request(app)
      .post('/otp/verify-otp')
      .send({ mobile: '+61473001475', otp: 'wrong-code' });

    expect(res.status).toBe(400);
    expect(res.text).toContain('Invalid or expired OTP');
  });
});
