/* eslint-disable @typescript-eslint/no-unused-vars */

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    throw new Error("Not implemented");
  },

  post: async <T>(url: string, body?: unknown): Promise<T> => {
    throw new Error("Not implemented");
  },
};