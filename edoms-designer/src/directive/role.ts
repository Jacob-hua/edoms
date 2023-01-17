import { Directive, DirectiveBinding } from 'vue';

import useAccountStore from '@/store/account';

const roleDirective: Directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    const { role } = useAccountStore();
    if (binding.value !== role) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  },
};

export default roleDirective;
