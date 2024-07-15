// File: tests/otp.test.ts
import request from 'supertest';
import express, { Express } from 'express';
import otpRouter from '../src/routes/otp';
import * as dotenv from 'dotenv';
import { ConnectionPool } from 'mssql';

// Load environment variables
dotenv.config();

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

// Mock Twilio
jest.mock('twilio', () => {
  const createMock = jest.fn();
  const verificationChecksCreateMock = jest.fn();

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      verify: {
        v2: {
          services: jest.fn().mockReturnValue({
            verifications: {
              create: createMock,
            },
            verificationChecks: {
              create: verificationChecksCreateMock,
            },
          }),
        },
      },
    })),
    createMock,
    verificationChecksCreateMock,
  };
});

describe('OTP Endpoints', () => {
  let createMock: jest.Mock;
  let verificationChecksCreateMock: jest.Mock;

  beforeAll(() => {
    const twilio = require('twilio');
    createMock = twilio.createMock;
    verificationChecksCreateMock = twilio.verificationChecksCreateMock;

    // Set up the mock implementation for verifications.create
    createMock.mockResolvedValue({});

    // Set up the mock implementation for verificationChecks.create
    verificationChecksCreateMock.mockResolvedValue({ status: 'approved' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send OTP successfully', async () => {
    const res = await request(app)
      .post('/otp/send-otp')
      .send({ mobile: '+61473001475' });

    // Check if the request was successful
    expect(res.status).toBe(200);
    expect(res.text).toContain('OTP sent successfully');

    // Ensure the mock method was called with the correct parameters
    expect(createMock).toHaveBeenCalledWith({
      to: '+61473001475',
      channel: 'sms',
    });
  });

  it('should verify OTP successfully', async () => {
    const res = await request(app)
      .post('/otp/verify-otp')
      .send({ mobile: '+61473001475', otp: '123456' });

    // Check if the request was successful
    expect(res.status).toBe(200);
    expect(res.text).toContain('OTP verified successfully');

    // Ensure the mock method was called with the correct parameters
    expect(verificationChecksCreateMock).toHaveBeenCalledWith({
      to: '+61473001475',
      code: '123456',
    });
  });

  it('should fail to verify OTP with wrong code', async () => {
    // Mock the verification check to fail
    verificationChecksCreateMock.mockResolvedValueOnce({
      status: 'pending',
    });

    const res = await request(app)
      .post('/otp/verify-otp')
      .send({ mobile: '+61473001475', otp: 'wrong-code' });

    // Check if the request was unsuccessful
    expect(res.status).toBe(400);
    expect(res.text).toContain('Invalid or expired OTP');
  });
});
