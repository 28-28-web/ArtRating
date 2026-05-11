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

  const url = `https://sms.mimsms.com/api/sendsms?api_key=${apiKey}&api_secret=${username}&mobile=88${phone}&smstext=Your ArtRating OTP: ${otp}&sid=ArtRating&mtype=TEXT&jsonResponse=1`;

  const res = await fetch(url);
  const data = await res.json();

  return { success: res.ok, data };
}