import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createRouteClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      utrNumber,
      planName,
      billingCycle,
      price,
      credits,
      message,
      isRegisteredUser,
      userId,
    } = body

    // Validation
    if (!name || !email || !planName) {
      return NextResponse.json(
        { error: "Name, email, and plan name are required." },
        { status: 400 }
      )
    }

    // Best-effort record in Supabase leads table
    try {
      const supabase = await createRouteClient()
      await supabase.from("leads").insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        interest: `Subscription: ${planName} (${billingCycle})`,
        source: "pricing_upi_qr",
        status: "pending_verification",
        notes: `Plan: ${planName} | Price: ${price} | Credits: ${credits} | UTR: ${utrNumber || "N/A"} | Registered: ${isRegisteredUser ? "Yes" : "No"} | Notes: ${message || "None"}`,
      })
    } catch (dbErr) {
      console.warn("Could not record subscription in leads table (non-blocking):", dbErr)
    }

    // Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.MAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    const mailSubject = utrNumber
      ? `[PAID UPI: ${utrNumber}] ${planName} (${price}) — ${name}`
      : `Subscription Request: ${planName} — ${name}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f1f5f9; margin: 0; padding: 20px; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #10b981, #6366f1, #ec4899); color: white; padding: 28px 24px; text-align: center; }
          .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 0; font-size: 13px; opacity: 0.92; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; background: rgba(255,255,255,0.25); font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; }
          .body { padding: 28px 24px; }
          .utr-card { background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 18px; margin-bottom: 20px; text-align: center; }
          .utr-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #047857; letter-spacing: 0.8px; }
          .utr-value { font-size: 24px; font-weight: 900; color: #065f46; font-family: monospace; letter-spacing: 1.5px; margin: 6px 0; }
          .utr-sub { font-size: 12px; color: #059669; }
          .plan-card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
          .plan-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
          .plan-price { font-size: 24px; font-weight: 900; color: #10b981; }
          .plan-meta { font-size: 12px; color: #64748b; margin-top: 4px; }
          .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .field { margin-bottom: 14px; }
          .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
          .value { font-size: 14px; font-weight: 600; color: #0f172a; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .notes-box { background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #92400e; }
          .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${utrNumber ? "UPI Payment Received" : "Subscription Request"}</h1>
            <p>From Celoris AI Pricing Portal</p>
            <div class="badge">${billingCycle === "annual" ? "Annual Billing (Save 20-25%)" : "Monthly Billing"}</div>
          </div>
          <div class="body">
            ${utrNumber ? `
              <div class="utr-card">
                <div class="utr-label">UPI Reference / UTR Number</div>
                <div class="utr-value">${utrNumber}</div>
                <div class="utr-sub">Verified Merchant: <strong>celoris@icici</strong> (M/S. CELORIS DESIGNS LLP)</div>
              </div>
            ` : ""}

            <div class="plan-card">
              <div class="plan-title">${planName}</div>
              <div class="plan-price">${price}</div>
              <div class="plan-meta">Credits Quota: <strong>${credits}</strong></div>
            </div>

            <div class="section-title">Customer Details</div>

            <div class="field">
              <div class="label">Customer Name</div>
              <div class="value">${name}</div>
            </div>

            <div class="field">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></div>
            </div>

            <div class="field">
              <div class="label">Phone / WhatsApp Number</div>
              <div class="value">${phone || "Not provided"}</div>
            </div>

            <div class="field">
              <div class="label">Account Status</div>
              <div class="value">${isRegisteredUser ? `Registered User (ID: ${userId || "Active"})` : "Guest / New User"}</div>
            </div>

            ${message ? `
              <div class="field">
                <div class="label">Customer Notes / GST / Questions</div>
                <div class="notes-box">${message}</div>
              </div>
            ` : ""}
          </div>
          <div class="footer">
            <p>Direct reply to this email will respond to: ${email}</p>
            <p>Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME || "Celoris AI"}" <${process.env.MAIL_FROM_ADDRESS || "support@celorisdesigns.com"}>`,
      to: "support@celorisdesigns.com",
      replyTo: email,
      subject: mailSubject,
      html: htmlContent,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      {
        success: true,
        message: "Payment confirmation received! Our accounts team is verifying and will activate your subscription shortly.",
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error processing subscription request:", error)
    return NextResponse.json(
      { error: "Failed to process payment confirmation. Please reach out on WhatsApp or email." },
      { status: 500 }
    )
  }
}
