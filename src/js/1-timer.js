import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  dateTime: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate;
let intervalId = null;

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (!selectedDates[0]) {
      return;
    }

    // Дата в прошлом ИЛИ точно сейчас — невалидна
    if (selectedDates[0].getTime() <= Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
      });

      refs.startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDates[0].getTime();
    refs.startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

refs.startBtn.addEventListener('click', onBtnClick);

function onBtnClick() {
  refs.startBtn.disabled = true;
  refs.dateTime.disabled = true;

  updateTimer();

  intervalId = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const remainingTime = userSelectedDate - Date.now();

  if (remainingTime <= 0) {
    clearInterval(intervalId);

    refs.days.textContent = '00';
    refs.hours.textContent = '00';
    refs.minutes.textContent = '00';
    refs.seconds.textContent = '00';

    refs.dateTime.disabled = false;

    return;
  }

  const { days, hours, minutes, seconds } = convertMs(remainingTime);

  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
