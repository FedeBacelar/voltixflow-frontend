export interface IRole {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  username: string;
  password: string;
  active: boolean;
  role: IRole;
}

export interface IGetAllUserQuery {
  pageNumber: number;
  pageSize: number;
  name?: string;
  roleId?: number;
}

export interface ICreateUser {
  username: string;
  password: string;
  active: boolean;
  role: IRole;
}

export interface IUpdateUser {
  username: string;
  password: string;
  active: boolean;
  role: IRole;
}
