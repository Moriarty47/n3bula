const UNIQUE_ID = Symbol('__vue_click_outside__');

const clickEventType = () => document.ontouchstart !== null ? 'click' : 'touchstart';

const onMounted = (el, binding, vnode) => {
  onUnmounted(el);

  let vm = vnode.context;
  let callback = binding.value;

  let nextTick = false;
  setTimeout(() => nextTick = true, 0);

  el[UNIQUE_ID] = (event) => {
    if (
      (!el || !el.contains(event.target)) &&
      typeof callback === 'function' &&
      nextTick
    ) {
      return callback.call(vm, event);
    }
  };

  el.previousElementSibling.addEventListener(clickEventType(), el[UNIQUE_ID], false);
};

const onUnmounted = (el) => {
  el.previousElementSibling.removeEventListener(clickEventType(), el[UNIQUE_ID], false);
  delete el[UNIQUE_ID];
};

const onUpdated = (el, binding, vnode) => {
  if (binding.value === binding.oldValue) {
    return;
  }
  onMounted(el, binding, vnode);
};


/** @type {import('vue').Directive} */
const ClickOutside = {
  mounted: onMounted,
  updated: onUpdated,
  unmounted: onUnmounted,
};

export default {
  install: (app) => {
    app.directive('click-outside', ClickOutside);
  }
};