export type ResizePanelStorage = {
  getItem(name: string): string | null;
  setItem(name: string, value: string): void;
};

const initializeDefaultStorage = (): ResizePanelStorage => {
  try {
    if (typeof localStorage !== 'undefined') {
      return {
        getItem(name: string) {
          return localStorage.getItem(name);
        },
        setItem(name: string, value: string) {
          localStorage.setItem(name, value);
        }
      };
    } else {
      throw Error('localStorage not supported');
    }
  } catch (error) {
    console.error(error);
    return { getItem: () => null, setItem: () => { } };
  }
};

export const defaultStorage = initializeDefaultStorage();