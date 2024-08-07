export interface ILogin {
  data: null | {
    access: string;
    refresh: string;
  };
  errorCode: null | number;
  message: string;
  ststus: number;
  success: boolean;
}

export interface IRegister {
  errorCode: null | number;
  message: string;
  ststus: number;
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
      username: string;
      first_name: string;
      last_name: string;
      middle_name: null;
      profile_photo: string;
      email_confirmed: false;
      birth_date: null;
      role: "USER";
    };
    tokens: {
      refresh: string;
      access: string;
    };
  };
}
