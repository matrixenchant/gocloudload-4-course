export const $class = (...classes: any[]) => {
  return classes
    .map((x) => (Array.isArray(x) ? (x[1] ? x[0] : null) : x))
    .filter((x) => x)
    .join(' ');
};

export const $sh = (loading = true, type: 'text' | 'block' = 'text') => {
  return $class('shimmer', ['sh--active', loading], `shimmer--${type}`);
};