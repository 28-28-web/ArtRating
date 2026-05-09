type SendOtpInput = {
  phone: string;
  otp: string;
};

export async function sendOtpSms({ phone, otp }: SendOtpInput) {
  const apiKey = process.env.SSL_WIRELESS_API_KEY;
  const sid = process.env.SSL_WIRELESS_SID;
  if (!apiKey || !sid) return { success: false, skipped: true };

  const params = new URLSearchParams({
    api_token: apiKey,
    sid,
    msisdn: `88${phone}`,
    sms: `আপনার ArtRating OTP: ${otp}`,
    csms_id: `artrating-${Date.now()}`,
  });

  const res = await fetch("https://smsplus.sslwireless.com/api/v3/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  return { success: res.ok };
}
