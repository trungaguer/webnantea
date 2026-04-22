import { useMutation } from "@tanstack/react-query";

export const useMutationHooks = (fnCallback, options = {}) => {
  const mutation = useMutation({
    mutationFn: fnCallback,
    ...options, // ✅ cho phép truyền onSuccess, onError từ ngoài
  });

  return mutation;
};
