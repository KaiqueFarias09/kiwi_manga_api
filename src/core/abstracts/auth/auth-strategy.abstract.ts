export abstract class IAuthStrategy {
  abstract validate(
    apiKey: string,
    done: (error: Error, data: any) => Record<string, never>,
  );
}
