export interface User {
  _id: any;
  email: string;
  username: string;
  authentication: {
    salt: string;
    password: string;
    sessionToken?: string;
  };
}
