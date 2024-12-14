export interface ExcursionType {
  id: number;
  title: string;
  description: string;
  city: string;
  date: string;
  price: number;
  photo: string | null;
  likes: number | null;
  dislikes: number | null;
  isFavorite: boolean;
}
