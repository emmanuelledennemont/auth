export interface Client {
  _id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  favorites: string[];
  repairList: string[];
  saving: any[];
}
