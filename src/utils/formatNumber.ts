// utils/formatNumber.ts

export const formatNumber = (num: number) => {
  return num.toLocaleString();
};

export const formatKrw = (num: number) => {
  return `${num.toLocaleString()}원`;
};

export const formatUsd = (num: number) => {
  return `$${num.toLocaleString()}`;
};
