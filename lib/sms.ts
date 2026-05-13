type SendOtpInput = {
  phone: string;
  otp: string;
};

export async function sendOtpSms({ phone, otp }: SendOtpInput) {
  const apiKey = process.env.MIMSMS_API_KEY;
  const username = process.env.MIMSMS_USERNAME;

  if (!apiKey || !username) {
    console.log(`OTP for ${phone}: ${otp}`);
    return { success: true, skipped: true };
  }

  const mobileNumber = `880${phone.replace(/^0/, '')}`;

  const res = await fetch('https://api.mimsms.com/api/SmsSending/SMS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'bearer',
    },
    body: JSON.stringify({
      UserName: username,
      Apikey: apiKey,
      MobileNumber: mobileNumber,
      CampaignId: '',
      SenderName: '01896050632',
      TransactionType: 'T',
      Message: `Welcome to ArtRating. Your verification code is ${otp}. Valid for 5 minutes only.`,
    }),
  });

  const data = await res.json();
  console.log('[MiMSMS Response]', JSON.stringify(data));
  return { success: data.statusCode === '200', data };
}