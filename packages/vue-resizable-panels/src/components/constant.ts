import type { InjectionKey } from 'vue';
import type { GroupData } from './panel-group.vue';

export const InjectionGroupData = Symbol('groupData') as InjectionKey<GroupData>;

export const PERCISION = 10;