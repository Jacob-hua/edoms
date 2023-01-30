import { DirectiveBinding, ObjectDirective } from 'vue';

import usePermissionStore from '@/store/permission';

const permissionDirective: ObjectDirective = {
  mounted: (el: HTMLElement, binding: DirectiveBinding<string>) => {
    const { value: permission } = binding;
    const { hasPermission } = usePermissionStore();
    if (permission && !hasPermission(permission)) {
      el.style.display = 'none';
    }
  },
};

export default permissionDirective;
