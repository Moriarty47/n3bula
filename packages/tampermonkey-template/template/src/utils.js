import { unsafeWindow, GM_setClipboard } from '$';

const storageKey = '{{packageName}}-enhanced';

/** @type {(fnNames: string | string[]) => boolean} */
export const checkFunctionsExists = (fnNames) => {
  fnNames = Array.isArray(fnNames) ? fnNames : [fnNames];
  if (fnNames.every(fnName => unsafeWindow[fnName] && typeof unsafeWindow[fnName] === 'function')) {
    return true;
  }

  console.warn(`The function(s) ${fnNames.join(', ')} doesn't exists. should override source code to expose it.`);
  return false;
};
/** @type {((key: string) => string) & (() => Record<string, any>)} */
export const getConfig = (key) => {
  const config = JSON.parse(unsafeWindow.localStorage.getItem(storageKey)) || {};
  if (key) return config[key];
  return config;
};

/** @type {((key: string, value: string) => void) & ((config: Record<string, any>) => void)} */
export const setConfig = (...args) => {
  if (args.length === 1) {
    unsafeWindow.localStorage.setItem(storageKey, JSON.stringify(args[0]));
    return;
  }
  const [key, value] = args;
  const config = getConfig();
  config[key] = value;
  unsafeWindow.localStorage.setItem(storageKey, JSON.stringify(config));
};

/** @type {(type: 'success' | 'warn' | 'error', msg: string) => void} */
export const toast = (type, msg) => {
  iqwerty.toast.toast(msg, {
    style: {
      main: {
        background: type === 'success' ? 'green' : type === 'warn' ? 'orange' : 'red',
        color: 'white',
      },
    },
  });
};

/** @type {((className: `.${string}`, appendToElement: HTMLElement) => HTMLElement) & ((id: string, appendToElement: HTMLElement) => HTMLElement)} */
export const createContainer = (idOrClassName, appendToElement = document.body) => {
  const wrapper = document.createElement('div');
  if (idOrClassName.startsWith('.')) {
    wrapper.className = idOrClassName.slice(1);
  } else {
    wrapper.id = idOrClassName;
  }
  appendToElement.appendChild(wrapper);
  return wrapper;
};

/** @type {(ele: HTMLElement, maxLookupTime: number) => HTMLElement | null} */
export const findLiTagOfEle = (ele, maxLookupTime = 5) => {
  let liEle = ele;
  while (maxLookupTime) {
    liEle = liEle.parentElement;
    if (liEle.tagName === 'LI' && liEle.id) return liEle;
    maxLookupTime--;
  }
  return null;
};

/** @type {(url: string) => Promise<string>} */
export const copyLink = (url) => {
  if (!url) {
    toast('warn', '下载链接不存在！');
    return Promise.reject('No exist.');
  }
  return new Promise((resolve) => {
    GM_setClipboard(url, 'text', () => {
      toast('success', '下载链接已复制！');
      resolve(url);
    });
  });
};

/**
 * Configuration for the observer:
 * childList: true - observe additions and removals of child nodes
 * subtree: true - observe changes in the entire subtree of the target
 * @param {HTMLElement} element 
 * @param {() => void} findCallback 
 * @param {MutationObserverInit} config 
 * @return {() => void}
 */
export const observeElementLoaded = (element, findCallback = () => { }, config = { childList: true, subtree: true }) => {

  // Callback for the MutationObserver
  const observerCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if the target element exists in the newly added nodes
        if (findCallback()) return;
      }
    }
  };

  // Create a new MutationObserver instance
  const observer = new MutationObserver(observerCallback);

  // Start observing the document body for changes
  observer.observe(element, config);

  return () => observer.disconnect();
};

/** @type {Record<'success' | 'warn' | 'error',(msg: string) => void>} */
export const log = {
  success: (msg) => console.log(`\x1b[97;42m[${msg}]\x1b[m`),
  warn: (msg) => console.log(`\x1b[97;43m[${msg}]\x1b[m`),
  error: (msg) => console.log(`\x1b[97;101m[${msg}]\x1b[m`),
};