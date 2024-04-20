import {
  PrevIcon,
  NextIcon,
  CloseIcon,
  ResetIcon,
  FlipXIcon,
  FlipYIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCwIcon,
  RotateCcwIcon,
} from '../shared/icons';
import type { ActionIcon } from './types';

// eslint-disable-next-line react-refresh/only-export-components
export const ToolbarActions: ActionIcon[] = [
  {
    type: 'close',
    icon: CloseIcon,
    pin: true,
  },
  {
    type: 'prev',
    icon: PrevIcon,
    fnType: 'changeable',
    pin: true,
  },
  {
    type: 'next',
    icon: NextIcon,
    fnType: 'changeable',
    pin: true,
  },
  {
    type: 'zoomIn',
    icon: ZoomInIcon,
    fnType: 'zoomable',
  },
  {
    type: 'zoomOut',
    icon: ZoomOutIcon,
    fnType: 'zoomable',
  },
  {
    type: 'rotateLeft',
    icon: RotateCcwIcon,
    fnType: 'rotatable',
  },
  {
    type: 'rotateRight',
    icon: RotateCwIcon,
    fnType: 'rotatable',
  },
  {
    type: 'scaleX',
    icon: FlipXIcon,
    fnType: 'flipable',
  },
  {
    type: 'scaleY',
    icon: FlipYIcon,
    fnType: 'flipable',
  },
  {
    type: 'reset',
    icon: ResetIcon,
  },
];