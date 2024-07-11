class CustomError extends Error {
  public status: number  

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.message = message
    this.stack = process.env.NODE_ENV === "production" ? "" : this.stack
  }
}

export default CustomError