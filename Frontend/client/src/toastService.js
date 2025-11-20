// Simple toast service to decouple axios interceptors from React
const subscribers = new Set();

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

function notify(toast) {
  subscribers.forEach((fn) => fn(toast));
}

export function showSuccess(message) {
  notify({ type: 'success', message });
}

export function showError(message) {
  notify({ type: 'error', message });
}

export default { subscribe, showSuccess, showError };
