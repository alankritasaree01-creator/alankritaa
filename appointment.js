/* ============================================================
   ALANKRITA — appointment.js
   Custom calendar, time slots, form, confirmation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── STATE ─────────────────────────────────────────────────── */
  const today       = new Date();
  today.setHours(0, 0, 0, 0);
  let viewYear  = today.getFullYear();
  let viewMonth = today.getMonth();  // 0-indexed
  let selectedDate  = null;
  let selectedSlot  = null;

  const SLOTS = ['10:00 AM', '11:30 AM', '1:00 PM', '3:00 PM', '4:30 PM', '6:00 PM'];
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_LABELS  = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  /* ── CALENDAR ─────────────────────────────────────────────── */
  const monthLabel  = document.getElementById('calendarMonth');
  const calGrid     = document.getElementById('calendarGrid');
  const prevBtn     = document.getElementById('calPrev');
  const nextBtn     = document.getElementById('calNext');

  function renderCalendar() {
    if (!calGrid || !monthLabel) return;
    monthLabel.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;
    calGrid.innerHTML = '';

    // Day labels
    DAY_LABELS.forEach(d => {
      const el = document.createElement('div');
      el.className = 'calendar-day-label';
      el.textContent = d;
      calGrid.appendChild(el);
    });

    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'calendar-day empty';
      calGrid.appendChild(el);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const el = document.createElement('button');
      el.className = 'calendar-day';
      el.textContent = d;
      el.setAttribute('type', 'button');

      const isSunday  = date.getDay() === 0;
      const isPast    = date < today;

      if (isSunday || isPast) {
        el.classList.add('disabled');
        el.disabled = true;
      } else {
        // Check if today
        if (date.getTime() === today.getTime()) {
          el.classList.add('today');
        }

        // Check if selected
        if (selectedDate && date.getTime() === selectedDate.getTime()) {
          el.classList.add('selected');
        }

        el.addEventListener('click', () => selectDate(date, el));
      }

      calGrid.appendChild(el);
    }
  }

  function selectDate(date, el) {
    selectedDate = date;
    selectedSlot = null;
    calGrid.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    showTimeSlots(date);
  }

  prevBtn?.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  nextBtn?.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();

  /* ── TIME SLOTS ───────────────────────────────────────────── */
  function showTimeSlots(date) {
    const wrap = document.getElementById('timeSlotsWrap');
    const grid = document.getElementById('timeSlotsGrid');
    if (!wrap || !grid) return;

    // Deterministically pick 2 "booked" slots based on date
    const seed = date.getDate() + date.getMonth() * 31;
    const bookedIdx = new Set([seed % 6, (seed * 3 + 2) % 6]);

    grid.innerHTML = '';
    SLOTS.forEach((slot, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      if (bookedIdx.has(i)) {
        btn.className = 'time-slot-btn booked';
        btn.textContent = `${slot} · Booked`;
        btn.disabled = true;
      } else {
        btn.className = 'time-slot-btn';
        btn.textContent = slot;
        btn.addEventListener('click', () => {
          grid.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedSlot = slot;
        });
      }
      grid.appendChild(btn);
    });

    wrap.style.display = 'block';
  }

  /* ── FORM SUBMIT ───────────────────────────────────────────── */
  const form = document.getElementById('appointmentForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert('Please select a date for your appointment.');
      return;
    }
    if (!selectedSlot) {
      alert('Please select a time slot.');
      return;
    }

    const name  = document.getElementById('apptName').value.trim();
    const phone = document.getElementById('apptPhone').value.trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }

    showConfirmation(name, phone);
  });

  function showConfirmation(name, phone) {
    const formSection = document.getElementById('apptFormSection');
    const confCard    = document.getElementById('confirmationCard');
    const confText    = document.getElementById('confirmationDetail');

    const dateStr = selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    confText.innerHTML = `
      <strong>${name}</strong> — ${dateStr} at <strong>${selectedSlot}</strong><br><br>
      We'll reach out to you on <strong>${phone}</strong> to confirm your appointment.
    `;

    // WhatsApp link
    const waMsg = encodeURIComponent(`Hi Alankrita! I've booked an appointment for ${dateStr} at ${selectedSlot}. My name is ${name} and my contact is ${phone}.`);
    const waBtn = document.getElementById('confirmWhatsapp');
    if (waBtn) {
      waBtn.href = `https://wa.me/918412845177?text=${waMsg}`;
    }

    if (formSection) formSection.style.display = 'none';
    if (confCard) confCard.classList.add('show');

    // Scroll to confirmation
    confCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* Hide time slots initially */
  const wrapInit = document.getElementById('timeSlotsWrap');
  if (wrapInit) wrapInit.style.display = 'none';

});
