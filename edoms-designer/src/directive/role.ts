import { DirectiveBinding, ObjectDirective } from 'vue';

import useAccountStore from '@/store/account';

const roleDirective: ObjectDirective = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    const { value: role } = binding;
    const { hasRole } = useAccountStore();
    if (role && Array.isArray(role) && role.length > 0 && !hasRole(role)) {
      el.style.display = 'none';
    } else {
      // throw new Error('鉴权指令不正确');
    }
  },
};

export default roleDirective;
