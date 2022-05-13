import { useHooks } from "../providers/web3";

const _isEmpty = (data) => {
  return (
    data == null ||
    data === "" ||
    (Array.isArray(data) && data.length === 0) ||
    (data.constructor === Object && Object.keys(data).length === 0)
  );
};

const enhanceHook = (swrRes) => {
  const { data, error } = swrRes;
  const hasInitialResponse = !!(data || error);
  const isEmpty = hasInitialResponse && _isEmpty(data);

  return {
    ...swrRes,
    hasInitialResponse,
    isEmpty,
  };
};

export const useAccount = () => {
  const res = enhanceHook(useHooks((hooks) => hooks.useAccount)());

  return res;
};

export const useNetwork = () => {
  const res = enhanceHook(useHooks((hooks) => hooks.useNetwork)());
  return {
    network: res,
  };
};
