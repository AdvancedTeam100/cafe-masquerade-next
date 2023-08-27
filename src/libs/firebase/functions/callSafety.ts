import { functions } from '@/libs/firebase';
import dayjs from 'dayjs';

type CallSafetyType = {
  funcName: string;
  maxSeconds?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arg?: { [key: string]: any };
};

// ref: https://en.wikipedia.org/wiki/Exponential_backoff
export const callSafety = async ({
  funcName,
  arg,
  maxSeconds = 16, // デフォルトで4回程度試行する.
}: CallSafetyType) => {
  const func = functions.httpsCallable(funcName);
  const startAt = dayjs();

  const errorList = [];
  let index = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (dayjs().diff(startAt, 'seconds') > maxSeconds) {
      break;
    }

    try {
      const res = await func(arg);
      return res.data;
    } catch (e: unknown) {
      console.log(
        `Cloud Functions (${funcName}) の${index}回目の実行に失敗しました．${e}`,
      );
      errorList.push(e);
    }

    const randomSeconds = Math.random();
    await new Promise((resolve) =>
      setTimeout(resolve, (index ** 2 + randomSeconds) * 1000),
    );
    index++;
  }

  throw new Error(
    `Cloud Fcuntions (${funcName}) の実行に失敗しました．試行回数: ${index}. ${errorList}`,
  );
};
