export abstract class IApiKeyStrategy {
  abstract validate(
    apiKey: string,
    done: (error: Error, data: any) => Record<string, never>,
  );
}
