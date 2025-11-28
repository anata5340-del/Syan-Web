export type Admin = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  excludedModules: string[];
};

export type AdminPayload = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  excludedModules: string[];
};
