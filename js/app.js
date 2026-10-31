/**
 * Core Logic: Countdown synced to IST & Google Calendar
 * Harshita & Akash Engagement Invitation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Countdown Timer synced to Indian Standard Time (IST)
  // Sunday, November 15, 2026 at 11:00 PM IST (23:00 IST = 17:30 UTC)
  const targetEpoch = Date.UTC(2026, 10, 15, 17, 30, 0);

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minutesEl = document.getElementById('cdMinutes');
  const secondsEl = document.getElementById('cdSeconds');

  function updateCountdown() {
    const now = Date.now();
    const distance = targetEpoch - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 2. Google Calendar Integration
  const eventTitle = encodeURIComponent("Harshita & Akash Engagement (#BaatPakki)");
  const eventDetails = encodeURIComponent(
    "With joy in our hearts, we invite you to celebrate the engagement ceremony of Harshita & Akash. Venue: VINN Signature Prime by Vesta, Near Chitrakoot Marg, Jaipur."
  );
  const eventLocation = encodeURIComponent("VINN Signature Prime by Vesta, Near Chitrakoot Marg, Jaipur, Rajasthan");
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=20261115T173000Z/20261115T213000Z&details=${eventDetails}&location=${eventLocation}`;

  const btnGoogleCal = document.getElementById('btnGoogleCal');
  const btnGoogleCalMiddle = document.getElementById('btnGoogleCalMiddle');
  const btnGoogleCalBottom = document.getElementById('btnGoogleCalBottom');

  if (btnGoogleCal) {
    btnGoogleCal.href = googleCalUrl;
    btnGoogleCal.target = "_blank";
  }

  if (btnGoogleCalMiddle) {
    btnGoogleCalMiddle.href = googleCalUrl;
    btnGoogleCalMiddle.target = "_blank";
  }

  if (btnGoogleCalBottom) {
    btnGoogleCalBottom.href = googleCalUrl;
    btnGoogleCalBottom.target = "_blank";
  }
});
