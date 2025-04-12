class CustomError extends Error {
  public errorType: string;
  public details: Record<string, any>;

  constructor(errorType: string, message: string, details: Record<string, any>) {
    super(message);
    this.errorType = errorType;
    this.name = errorType;
    this.details = details;
  }

  toJSON() {
    return {
      error: this.errorType,
      message: this.message,
      details: this.details,
    };
  }
}

export default CustomError;
