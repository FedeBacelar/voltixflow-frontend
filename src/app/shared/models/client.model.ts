export interface IClientType {
  id: number;
  name: string;
}

export interface IClient {
  id:           number;
  name:         string;
  clientType:   IClientType;
  cuit:         string;
  phone:        string;
  contact:      string;
  email:        string;
  address:      string;
  status:       boolean;
  observations: string;
}

export interface IGetAllClientQuery {
  pageNumber: number;
  pageSize:   number;
  name?:      string;
  cuit?:      string;
  email?:     string;
}

export interface ICreateClient {
  name: string,
  clientTypeId: number,
  cuit: string,
  phone: string,
  contact: string,
  email: string,
  address: string,
  status: true,
  observations: string
}
