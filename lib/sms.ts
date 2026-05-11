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

  const message = encodeURIComponent(`Your ArtRating OTP: ${otp}`);
  const url = `https://sms.mimsms.com/api/SendSMS?ApiKey=${apiKey}&ClientId=${username}&SenderId=01896050632&Message=${message}&MobileNumbers=88${phone}&Is_Unicode=false&Is_Flash=false`;

  const res = await fetch(url);
  const text = await res.text();
  console.log('[MiMSMS Response]', text);

  return { success: res.ok, data: text };
}