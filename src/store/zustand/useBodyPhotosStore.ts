import { createPhotoStore } from './createPhotoStore';

/**
 * Sodda примерка uchun saqlangan TO'LIQ BO'Y suratlari.
 *
 * `useFacesStore` dan alohida turadi va shunday qolishi kerak: u yerda kvadrat
 * yuz kesimlari (768×768), bu yerda nisbati saqlangan butun bo'y kadrlari.
 * Ikkalasini bitta to'plamga qo'shsak, mijoz yuz kesimini sodda rejimga yoki
 * butun bo'y suratini yuz referensiga tanlab qo'yadi — ikkala holda ham natija
 * buziladi.
 */
export const useBodyPhotosStore = createPhotoStore('bridal-body-photos', 'Фото');
