/**
 * Twilio Verify Service helper for Celoris
 * Uses native fetch without heavy SDK dependencies.
 */

const getTwilioAuth = () => {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID

  if (!sid || !token || !verifySid) {
    throw new Error('Twilio credentials missing in environment variables')
  }

  const authHeader = 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64')
  return { sid, token, verifySid, authHeader }
}

export interface SendVerificationResult {
  success: boolean
  status?: string
  sid?: string
  error?: string
}

export interface CheckVerificationResult {
  success: boolean
  valid: boolean
  status?: string
  error?: string
}

/**
 * Sends a 6-digit verification code to a phone number via SMS or WhatsApp
 * @param phone Formatted E.164 phone number (e.g. +919876543210)
 * @param channel 'sms' | 'whatsapp'
 */
export async function sendTwilioOtp(
  phone: string,
  channel: 'sms' | 'whatsapp' = 'sms'
): Promise<SendVerificationResult> {
  try {
    const { verifySid, authHeader } = getTwilioAuth()

    // Ensure phone has leading +
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`

    const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/Verifications`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Channel: channel,
      }).toString(),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        error: data.message || `Twilio error code ${data.code}`,
      }
    }

    return {
      success: true,
      status: data.status,
      sid: data.sid,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to send OTP via Twilio',
    }
  }
}

/**
 * Validates a verification code entered by the user
 * @param phone Formatted E.164 phone number
 * @param code 6-digit OTP code entered by user
 */
export async function verifyTwilioOtp(
  phone: string,
  code: string
): Promise<CheckVerificationResult> {
  try {
    const { verifySid, authHeader } = getTwilioAuth()

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`

    const res = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/VerificationCheck`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formattedPhone,
        Code: code.trim(),
      }).toString(),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        valid: false,
        error: data.message || `Twilio verification error ${data.code}`,
      }
    }

    const isValid = data.status === 'approved'
    return {
      success: true,
      valid: isValid,
      status: data.status,
    }
  } catch (err: any) {
    return {
      success: false,
      valid: false,
      error: err.message || 'Failed to verify OTP',
    }
  }
}
