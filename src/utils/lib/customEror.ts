interface IError {
  status: number;
}

class CustomError extends Error implements IError {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export default CustomError;
