// Set the date we're counting down to
var countDownDate = new Date("Mar 28, 2025 21:15:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "EXPIRED";
  }
}, 1000);

function adjustTimelineHeight() {
  const container = document.querySelector('.events-container');
  const timeline = document.querySelector('.timeline-line');
  
  timeline.style.height = container.scrollHeight-50 + 'px';
}

// Run on page load
window.addEventListener('load', adjustTimelineHeight);

// Also run if window is resized
window.addEventListener('resize', adjustTimelineHeight);


function setupEventListeners() {
  // Get all event divs
  const events = document.querySelectorAll('.event');
  
  // Add click event listener to each event
  events.forEach((event, index) => {
      event.addEventListener('click', function() {
          // This function will run when an event is clicked
          handleEventClick(this, index);
      });
      
      // Add a cursor pointer to indicate clickability
      event.style.cursor = 'pointer';
  });
}

var images = "images/"
function handleEventClick(eventElement, index) {
  console.log(`Event ${index + 1} clicked:`, eventElement.querySelector('h3').textContent);
  document.getElementById("event-image").src= images + eventElement.getAttribute("data-image")
}

const events = document.querySelectorAll('.event');
let now = new Date();
let dates = {"now": now};
for (let i = 0; i < events.length; i++)
{
  dates[events[i].id] = new Date(events[i].getAttribute("data-date"))
}
dates = Object.fromEntries(
  Object.entries(dates).sort((a, b) => a[1] - b[1])
);
let next = ""
const container = document.querySelector('.events-container');
container.style.scrollBehavior = 'smooth';
for(const [key, value] of Object.entries(dates))
{
  if(value > now)
  {
    next = document.getElementById(key);
    document.getElementById("event-image").src = images + next.getAttribute("data-image")
    break;
  }
}
const containerRect = container.getBoundingClientRect();
const nextRect = next.getBoundingClientRect();
const offset = nextRect.top - containerRect.top - 25;

// Smooth scroll to the element within the container
container.scrollBy({
  top: offset,
  behavior: 'smooth'
});
// Run when page loads
window.addEventListener('load', function() {
  adjustTimelineHeight();
  setupEventListeners();
});