export class CustomError extends Error {
  shouldDisplay: boolean;
  showBugReportDialog: boolean;

  constructor(
    name: string,
    message: string,
    shouldDisplay: boolean,
    showBugReportDialog: boolean
  ) {
    super(message);
    this.name = name;
    this.shouldDisplay = shouldDisplay;
    this.showBugReportDialog = showBugReportDialog;
  }
}

export class NetworkError extends CustomError {
  constructor(message: string) {
    super("Network error", message, false, false);
  }
}

export class ServerError extends CustomError {
  constructor(message: string) {
    super("Internal server error", message, true, true);
  }
}

export class UserError extends CustomError {
  constructor(name: string, message: string) {
    super(name, message, true, false);
  }
}
