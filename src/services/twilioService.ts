import Twilio from 'twilio';
import { DefaultOTPVerificationValues } from 'ezpzos.core';

const accountSid = process.env.TWILIO_ACCOUNT_SID || DefaultOTPVerificationValues.AccountSidDefaultValue; 
const authToken = process.env.TWILIO_AUTH_TOKEN || DefaultOTPVerificationValues.AuthTokenDefaultValue; 
const serviceSid = process.env.TWILIO_SERVICE_SID || DefaultOTPVerificationValues.ServiceSidDefaultValue;

const client = Twilio(accountSid, authToken);

export { client, serviceSid };