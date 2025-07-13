document.addEventListener('DOMContentLoaded', function() {
  const countdownContainer = document.getElementById('countdown-container');
  if (!countdownContainer) return;

  const endDateStr = countdownContainer.dataset.endDate;
  let countdownDate;

  if (endDateStr && !isNaN(Date.parse(endDateStr))) {
    countdownDate = new Date(endDateStr);
  } else {
    // Fallback: 2 days from now
    countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 2);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate.getTime() - now;

    if (distance <= 0) {
      document.querySelector('.countdown-days').textContent = '0';
      document.querySelector('.countdown-hours').textContent = '0';
      document.querySelector('.countdown-minutes').textContent = '0';
      document.querySelector('.countdown-seconds').textContent = '0';
      clearInterval(timer);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelector('.countdown-days').textContent = days;
    document.querySelector('.countdown-hours').textContent = hours;
    document.querySelector('.countdown-minutes').textContent = minutes;
    document.querySelector('.countdown-seconds').textContent = seconds;
  }

  updateCountdown(); // Initial run
  const timer = setInterval(updateCountdown, 1000);
});
