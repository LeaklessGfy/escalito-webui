export interface IUserInfoDTO {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
}

export type IUserDTO = IUserInfoDTO | null;

export type UserListener = (user: IUserDTO) => void;
