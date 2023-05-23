class CustomError extends Error {
    shouldDisplay: boolean;
  
    constructor(name: string, message: string, shouldDisplay: boolean) {
      super(message);
      this.name = name;
      this.shouldDisplay = shouldDisplay;
    }
}
  
class NetworkError extends CustomError {
    constructor(message: string) {
      super('Network error', message, false);
    }
}