import request from 'supertest';
import app from '../src/server';

describe('OTP Endpoints', () => {
  it('should send OTP', async () => {
    const res = await request(app)
      .post('/otp/send-otp')
      .send({
        mobile: '+61473001475'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('OTP sent successfully');
  });

  it('should verify OTP', async () => {
    const res = await request(app)
      .post('/otp/verify-otp')
      .send({
        mobile: '+61473001475',
        otp: '123456'  // Replace with the actual OTP
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('OTP verified successfully');
  });
});
