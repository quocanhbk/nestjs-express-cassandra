export class OrmError extends Error {
  readonly code: string;
  readonly metadata: {
    property?: string;
    type?: string;
    context: string;
    solution?: string;
  };

  constructor(
    code: string,
    metadata: {
      property?: string;
      type?: string;
      context: string;
      solution?: string;
    },
  ) {
    const message = OrmError.formatMessage(code, metadata);
    super(message);
    this.name = 'OrmError';
    this.code = code;
    this.metadata = metadata;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, OrmError.prototype);
  }

  private static formatMessage(code: string, metadata: any): string {
    switch (code) {
      case 'UNSUPPORTED_TYPE':
        return (
          `Unable to infer database type for property "${metadata.property}". ` +
          `The type "${metadata.type}" is not supported. ${metadata.solution}`
        );
      default:
        return `Unknown error occurred (${code})`;
    }
  }
}
