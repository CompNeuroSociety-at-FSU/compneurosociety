document.addEventListener('DOMContentLoaded', () => {
  const imagesPath = 'images/';
  const container = document.querySelector('.events-container');
  const events = Array.from(document.querySelectorAll('.event'));
  const eventImage = document.getElementById('event-image');
  const countdownEl = document.getElementById('countdown');

  function adjustTimelineHeight() {
    const timeline = document.querySelector('.timeline-line');
    if (!container || !timeline) return;
    timeline.style.height = Math.max(0, container.scrollHeight - 50) + 'px';
  }

  window.addEventListener('resize', adjustTimelineHeight);
  adjustTimelineHeight();

  function setupEventListeners() {
    events.forEach((ev, idx) => {
      ev.style.cursor = 'pointer';
      ev.addEventListener('click', () => {
        const imgName = ev.dataset.image || 'placeholder.png';
        console.log(`Event ${idx + 1} clicked:`, ev.querySelector('h3')?.textContent);
        eventImage.src = imagesPath + imgName;
      });
    });
  }

  setupEventListeners();

  // Find next event (first event with date > now). If none, pick most recent past or first event.
  const now = new Date();
  const eventsWithDates = events
      .map(ev => ({ el: ev, date: new Date(ev.dataset.date) }))
      .filter(x => !isNaN(x.date)); // drop invalid dates

  eventsWithDates.sort((a, b) => a.date - b.date);

  let nextObj = eventsWithDates.find(x => x.date > now);
  if (!nextObj) {
    // no future events: fall back to most recent past event, or the first event
    nextObj = eventsWithDates.length ? eventsWithDates[eventsWithDates.length - 1] : (events[0] ? { el: events[0], date: null } : null);
  }

  if (nextObj && nextObj.el) {
    const imgName = nextObj.el.dataset.image || 'placeholder.png';
    eventImage.src = imagesPath + imgName;

    // smooth scroll to the chosen event inside the container (guarded)
    try {
      container.style.scrollBehavior = 'smooth';
      const containerRect = container.getBoundingClientRect();
      const nextRect = nextObj.el.getBoundingClientRect();
      const offset = nextRect.top - containerRect.top - 25;
      container.scrollBy({ top: offset, behavior: 'smooth' });
    } catch (err) {
      console.warn('Could not scroll to next event:', err);
    }

    // Start a countdown only if we have a valid future date
    if (nextObj.date && nextObj.date > now && countdownEl) {
      let countDownDate = nextObj.date.getTime();
      const x = setInterval(() => {
        const nowMs = new Date().getTime();
        const distance = countDownDate - nowMs;
        if (distance <= 0) {
          clearInterval(x);
          countdownEl.textContent = 'EXPIRED';
          return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }, 1000);
    }
  } else {
    // No events at all: set a sensible default
    if (eventImage) eventImage.src = imagesPath + 'placeholder.png';
    if (countdownEl) countdownEl.textContent = 'No upcoming events';
  }
});