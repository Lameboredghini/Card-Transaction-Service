export interface ErrorDetails {
  [key: string]: any;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: ErrorDetails;
}
