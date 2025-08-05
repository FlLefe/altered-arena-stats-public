export type ResultSuccess<T> = {
  type: 'success';
  data: T;
};

export type ResultFailure = {
  type: 'failure';
  reason: string;
};

export type Result<T> = ResultSuccess<T> | ResultFailure;

export const ResultSuccess = <T>(data: T): ResultSuccess<T> => ({
  type: 'success',
  data,
});

export const ResultFailure = (reason: string): ResultFailure => ({
  type: 'failure',
  reason,
});

// Type guard functions
export function isSuccess<T>(result: Result<T>): result is ResultSuccess<T> {
  return result.type === 'success';
}

export function isFailure<T>(result: Result<T>): result is ResultFailure {
  return result.type === 'failure';
}
