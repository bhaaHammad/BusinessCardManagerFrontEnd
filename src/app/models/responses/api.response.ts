export interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: {
    result: T;
    success: boolean;
    message: string;
    errorList: any[];
  };
  errors: any[];
  timeGenerated: string;
}
