export type SlideCar = {
  id: string;
  name: string;
  generation: string;
  year: string;
  engine: string;
  horsepower: number;
  owner: string;
  description?: string;
  image: string;
  images: string[];
};

export function carGallery(car: SlideCar): string[] {
  if (car.images?.length) return car.images;
  if (car.image) return [car.image];
  return ["/images/m4.jpeg"];
}
