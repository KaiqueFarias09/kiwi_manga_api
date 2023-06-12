export abstract class IHealthRepository {
  abstract getHealth(): { version: string };
}
