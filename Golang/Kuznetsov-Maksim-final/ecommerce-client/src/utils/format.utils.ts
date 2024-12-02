export const formatTime = (time: number) => {
  if (time < 60) return time.toString();

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
};

export const formatPercent = (num: number) => {
  return +num.toFixed(1);
};

export const formatPhone = (phone: string) => {
  // Удаляем все символы, кроме цифр
  const cleaned = phone.replace(/\D/g, '');

  // Разделяем части номера
  const country = cleaned.slice(0, 1);
  const operator = cleaned.slice(1, 4);
  const part1 = cleaned.slice(4, 7);
  const part2 = cleaned.slice(7, 9);
  const part3 = cleaned.slice(9, 11);

  // Форматируем номер телефона
  const formatted = `+${country} (${operator}) ${part1} ${part2}-${part3}`;

  return formatted;
};

export function pluralize(amount: number, cases: string[], show_amount: boolean = true) {
  if (amount === undefined) return '';
  if (cases.length === 1) return `${amount} ${cases[0]}`;
  const indexes = [2, 0, 1, 1, 1, 2];
  const mod100 = amount % 100;
  const mod10 = amount % 10;
  const index = mod100 > 4 && mod100 < 20 ? 2 : indexes[mod10 < 5 ? mod10 : 5];
  return `${show_amount ? amount + ' ' : ''}${cases[index]}`;
}

export function formatPrice(price: number) {
  return '$' + price.toLocaleString();
}
