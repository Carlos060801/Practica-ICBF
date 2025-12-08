// utils/fechaBogota.js
export const fechaBogota = () => {
  const ahoraUTC = new Date();
  const bogota = new Date(ahoraUTC.getTime() - (5 * 60 * 60 * 1000));
  return bogota;
};
