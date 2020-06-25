export interface UserInfoDto {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
}

export type UserDto = UserInfoDto | null;

export type UserListener = (user: UserDto) => void;
