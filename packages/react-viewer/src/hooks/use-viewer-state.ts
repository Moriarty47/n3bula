import { useCallback, useState } from 'react';
import { getId } from '@n3bula/utils';

export type UseViewerStateProps = {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: () => void;
  id?: string;
};



const useViewerState = ({
  id,
  isOpen: customIsOpen,
  onOpen: customOnOpen,
  onClose: customOnClose,
  onChange = () => { },
}: UseViewerStateProps = {}) => {
  const viewerId = id || getId();
  const [isOpen, setIsOpen] = useState(customIsOpen || false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    onChange();
    customOnOpen?.();
  }, [customOnOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onChange();
    customOnClose?.();
  }, [customOnClose]);

  return {
    isOpen,
    onOpen,
    onClose,
    viewerId,
  };
};

export default useViewerState;
