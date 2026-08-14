const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'onboarding@resend.dev'; // Use Resend's test domain until custom domain is set up

// ── Booking Confirmation Email (sent to parent) ──
const sendBookingConfirmation = async ({ parentEmail, parentName, venueName, bookingDate, bookingTime, tickets, totalPrice, bookingId }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `HappyHop 🎡 <${FROM_EMAIL}>`,
      to: [parentEmail],
      subject: `Booking Confirmed! ${venueName} — ${bookingDate} 🎉`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F5F6FA;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6C5CE7,#a29bfe);border-radius:20px 20px 0 0;padding:36px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">🎡</div>
      <div style="color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">HappyHop</div>
      <div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px;">Your booking is confirmed!</div>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px;border-radius:0 0 20px 20px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <div style="font-size:20px;font-weight:800;color:#2D3436;margin-bottom:6px;">Hi ${parentName}! 👋</div>
      <div style="font-size:15px;color:#636E72;line-height:1.6;margin-bottom:24px;">
        Great news! Your visit to <strong style="color:#6C5CE7;">${venueName}</strong> is confirmed. We can't wait to see you!
      </div>

      <!-- Booking Details Card -->
      <div style="background:#F8F6FF;border-radius:14px;padding:20px;margin-bottom:24px;border:1.5px solid #EEE9FF;">
        <div style="font-size:13px;font-weight:700;color:#6C5CE7;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:14px;">Booking Details</div>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;font-size:14px;color:#636E72;">📍 Venue</td>
            <td style="padding:8px 0;font-size:14px;font-weight:700;color:#2D3436;text-align:right;">${venueName}</td>
          </tr>
          <tr style="border-top:1px solid #EEE9FF;">
            <td style="padding:8px 0;font-size:14px;color:#636E72;">📅 Date</td>
            <td style="padding:8px 0;font-size:14px;font-weight:700;color:#2D3436;text-align:right;">${bookingDate}</td>
          </tr>
          <tr style="border-top:1px solid #EEE9FF;">
            <td style="padding:8px 0;font-size:14px;color:#636E72;">🕐 Time</td>
            <td style="padding:8px 0;font-size:14px;font-weight:700;color:#2D3436;text-align:right;">${bookingTime}</td>
          </tr>
          <tr style="border-top:1px solid #EEE9FF;">
            <td style="padding:8px 0;font-size:14px;color:#636E72;">🎫 Tickets</td>
            <td style="padding:8px 0;font-size:14px;font-weight:700;color:#2D3436;text-align:right;">${tickets} child${tickets > 1 ? 'ren' : ''}</td>
          </tr>
          <tr style="border-top:1px solid #EEE9FF;">
            <td style="padding:8px 0;font-size:14px;color:#636E72;">💰 Total</td>
            <td style="padding:8px 0;font-size:16px;font-weight:800;color:#6C5CE7;text-align:right;">SAR ${totalPrice}</td>
          </tr>
        </table>
      </div>

      <!-- Tips -->
      <div style="background:#FFF8E7;border-radius:12px;padding:16px;margin-bottom:24px;">
        <div style="font-size:13px;font-weight:700;color:#E17055;margin-bottom:8px;">📌 Good to Know</div>
        <div style="font-size:13px;color:#636E72;line-height:1.7;">
          ✔ Arrive 10 minutes early for check-in<br>
          ✔ Bring this email as your booking reference<br>
          ✔ Comfortable clothes recommended for kids<br>
          ✔ Socks required inside the play area
        </div>
      </div>

      <!-- Booking ID -->
      <div style="text-align:center;padding:14px;background:#F5F6FA;border-radius:10px;margin-bottom:24px;">
        <div style="font-size:11px;color:#B0B3C6;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Booking Reference</div>
        <div style="font-size:18px;font-weight:800;color:#6C5CE7;letter-spacing:2px;margin-top:4px;">#HH-${String(bookingId).slice(-6).toUpperCase()}</div>
      </div>

      <div style="font-size:14px;color:#636E72;text-align:center;line-height:1.6;">
        Have questions? Reply to this email and we'll help right away.<br>
        <strong style="color:#2D3436;">See you soon! 🎉</strong>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:20px;font-size:12px;color:#B0B3C6;">
      HappyHop — Where Every Visit is an Adventure<br>
      <a href="https://happyhop.com" style="color:#6C5CE7;text-decoration:none;">happyhop.com</a>
    </div>
  </div>
</body>
</html>`
    });

    if (error) { console.error('Email error:', error); return false; }
    console.log('✅ Booking confirmation email sent to', parentEmail);
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
};

// ── Venue Notification Email (sent to venue owner when new booking arrives) ──
const sendVenueNewBooking = async ({ venueEmail, venueName, parentName, bookingDate, bookingTime, tickets, totalPrice }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `HappyHop 🎡 <${FROM_EMAIL}>`,
      to: [venueEmail],
      subject: `New Booking Request — ${bookingDate} at ${bookingTime}`,
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F5F6FA;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:linear-gradient(135deg,#00B894,#55efc4);border-radius:20px 20px 0 0;padding:32px;text-align:center;">
      <div style="font-size:42px;margin-bottom:8px;">📋</div>
      <div style="color:#fff;font-size:22px;font-weight:800;">New Booking Request</div>
      <div style="color:rgba(255,255,255,0.85);font-size:14px;margin-top:4px;">${venueName}</div>
    </div>
    <div style="background:#fff;padding:32px;border-radius:0 0 20px 20px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <div style="font-size:16px;color:#636E72;margin-bottom:20px;">A new booking request has arrived and is waiting for your confirmation.</div>
      <div style="background:#F0FFF8;border-radius:14px;padding:20px;border:1.5px solid #C3F0D8;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-size:14px;color:#636E72;">👤 Parent</td><td style="padding:8px 0;font-size:14px;font-weight:700;color:#2D3436;text-align:right;">${parentName}</td></tr>
          <tr style="border-top:1px solid #C3F0D8;"><td style="padding:8px 0;font-size:14px;color:#636E72;">📅 Date</td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right;">${bookingDate}</td></tr>
          <tr style="border-top:1px solid #C3F0D8;"><td style="padding:8px 0;font-size:14px;color:#636E72;">🕐 Time</td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right;">${bookingTime}</td></tr>
          <tr style="border-top:1px solid #C3F0D8;"><td style="padding:8px 0;font-size:14px;color:#636E72;">🎫 Tickets</td><td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right;">${tickets}</td></tr>
          <tr style="border-top:1px solid #C3F0D8;"><td style="padding:8px 0;font-size:14px;color:#636E72;">💰 Revenue</td><td style="padding:8px 0;font-size:16px;font-weight:800;color:#00B894;text-align:right;">SAR ${totalPrice}</td></tr>
        </table>
      </div>
      <div style="text-align:center;margin-top:24px;font-size:14px;color:#636E72;">
        Log in to your HappyHop Dashboard to confirm or manage this booking.
      </div>
    </div>
  </div>
</body>
</html>`
    });

    if (error) { console.error('Venue email error:', error); return false; }
    console.log('✅ Venue notification email sent');
    return true;
  } catch (err) {
    console.error('Venue email error:', err); return false;
  }
};

module.exports = { sendBookingConfirmation, sendVenueNewBooking };
