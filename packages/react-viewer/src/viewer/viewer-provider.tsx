import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useModalContext } from '../modal/modal-context';
import { ViewerContext } from './viewer-context';
import { isImageElement, isMobile, loadImage } from '../shared/utils';
import type {
  Size,
  Position,
  ScaleFactor,
  CanvasImage,
  ViewerProps,
  GetImageSize,
  CanvasLoadingImage,
} from './types';
import { useViewerProps } from './viewer-props-context';
import { useRegistry } from '../registry/registry-context';

const defaultImageProps = {
  width: 0,
  height: 0,
  top: 15,
  left: 0,
  rotate: 0,
  imgWidth: 0,
  imgHeight: 0,
  scaleX: 1,
  scaleY: 1,
  loading: true,
  loadFailed: false,
};

type ProviderImage = Required<CanvasLoadingImage>;

const ViewerProvider = ({ children }: { children: React.ReactNode; }) => {
  const {
    prefixCls,
    open,
    images,
    defaultSize,
    activeIndex: defaultIndex,
    scrollZoom,
    zoomSpeed,
    maxScale,
    minScale,
    flipable,
    zoomable,
    rotatable,
    changeable,
    onChange,
  } = useViewerProps();

  const { currentNodes, currentIndex } = useRegistry();
  const { container, onClose } = useModalContext();

  const imagesRef = useRef<CanvasImage[]>(images);
  const [activeIndex, setActiveIndex] = useState<number>(currentIndex || defaultIndex!);
  const [image, setImage] = useState<ProviderImage>({
    ...defaultImageProps,
    ...(imagesRef.current[activeIndex] || {}),
  } as ProviderImage);
  const currentLoadIndex = useRef<number>(-1);
  const containerSizeRef = useRef<Size>(getContainerSize(container));
  const toolbarSizeRef = useRef<Size>({ width: 0, height: 0 });

  imagesRef.current = useMemo(() => currentNodes ? ([
    ...currentNodes.map(node => isImageElement(node) ? ({
      ...defaultImageProps,
      src: node.src,
    }) : ({
      ...defaultImageProps,
      key: node.key,
      render: () => node.children,
    }))
  ]) : images, [images, currentNodes]);

  useEffect(() => {
    containerSizeRef.current = getContainerSize(container);
  }, [container]);

  useEffect(() => {
    currentLoadIndex.current = activeIndex;
    setImage({
      index: activeIndex,
      ...defaultImageProps,
      ...(imagesRef.current[activeIndex] || {})
    } as ProviderImage);
  }, [activeIndex]);

  useEffect(() => {
    if (!image.src) {
      if (image.index !== undefined) return;
      return;
    }
    // image node
    startLoadImage(currentLoadIndex.current);
    setTimeout(() => {
      onChange(image, currentLoadIndex.current);
    }, 10);
  }, [image.index]);

  const onPrev = useCallback(() => {
    if (!changeable) return;
    setActiveIndex(prev => {
      let idx = prev - 1;
      if (prev === 0) idx = imagesRef.current.length - 1;
      currentLoadIndex.current = idx;
      return idx;
    });
  }, [changeable]);

  const onNext = useCallback(() => {
    if (!changeable) return;
    setActiveIndex(prev => {
      let idx = prev + 1;
      if (prev === imagesRef.current.length - 1) idx = 0;
      currentLoadIndex.current = idx;
      return idx;
    });
  }, [changeable]);


  const onResize = () => {
    containerSizeRef.current = getContainerSize(container);
    if (open) {
      setImage(prev => ({
        ...prev,
        left: (containerSizeRef.current.width - (prev.width || 0)) / 2,
        top: (containerSizeRef.current.height - (prev.height || 0) - toolbarSizeRef.current.height) / 2,
      }));
    }
  };

  const onScaleX = useCallback((scaleX: ScaleFactor = -1) => {
    if (!flipable) return;
    setImage(prev => ({
      ...prev,
      scaleX: (prev.scaleX || 1) * scaleX,
    }));
  }, [flipable]);

  const onScaleY = useCallback((scaleY: ScaleFactor = -1) => {
    if (!flipable) return;
    setImage(prev => ({
      ...prev,
      scaleY: (prev.scaleY || 1) * scaleY,
    }));
  }, [flipable]);

  const onRotate = useCallback((cw: boolean = false) => () => {
    if (!rotatable) return;
    setImage(prev => ({
      ...prev,
      rotate: (prev.rotate || 0) + 90 * (cw ? 1 : -1),
    }));
  }, [rotatable]);

  const onZoomIn = useCallback(() => {
    if (!zoomable) return;
    setImage(prev => ({
      ...prev,
      ...zoomProcessor(
        getImageCenterPosition(prev),
        prev,
        getImageSize,
        { zoomSpeed, maxScale, minScale },
        1,
      )
    }));
  }, [zoomable, zoomSpeed, maxScale, minScale]);

  const onZoomOut = useCallback(() => {
    if (!zoomable) return;
    setImage(prev => ({
      ...prev,
      ...zoomProcessor(
        getImageCenterPosition(prev),
        prev,
        getImageSize,
        { zoomSpeed, maxScale, minScale },
        -1,
      )
    }));
  }, [zoomable, zoomSpeed, maxScale, minScale]);

  const wheelHandler = useCallback((e: WheelEvent) => {
    if (!zoomable) return;
    e.preventDefault();

    let scale: ScaleFactor = 0;
    const delta = e.deltaY;
    if (delta === 0) return;
    scale = delta > 0 ? -1 : 1;

    let { clientX: x, clientY: y } = e;
    if (container) {
      const rect = container.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
    setImage(prev => {
      if (prev.loading) return prev;
      return ({
        ...prev,
        ...zoomProcessor(
          { x, y },
          prev,
          getImageSize,
          { zoomSpeed, maxScale, minScale },
          scale,
        )
      });
    });
  }, [container, zoomable, zoomSpeed, maxScale, minScale]);

  useEffect(() => {
    if (!container) return;
    if (!isMobile && scrollZoom) {
      container.removeEventListener('wheel', wheelHandler, false);
    }

    container.addEventListener('wheel', wheelHandler, false);
    return () => {
      container.removeEventListener('wheel', wheelHandler, false);
    };
  }, [container]);

  const getImageSize = useCallback((size: { width: number, height: number; }) => {
    const maxWidth = containerSizeRef.current.width * 0.8;
    const maxHeight = (containerSizeRef.current.height - toolbarSizeRef.current.height) * 0.8;
    let width = Math.min(maxWidth, size.width);
    let height = width / size.width * size.height;
    if (height > maxHeight) {
      height = maxHeight;
      width = height / size.height * size.width;
    }
    const left = (containerSizeRef.current.width - width) / 2;
    const top = (containerSizeRef.current.height - height - toolbarSizeRef.current.height) / 2;
    return { width, height, left, top };
  }, [containerSizeRef, toolbarSizeRef]);

  async function startLoadImage(currentActiveIndex: number) {
    let image: CanvasLoadingImage | null = null;
    const currentImage = imagesRef.current[currentActiveIndex];
    if (imagesRef.current.length > 0) {
      image = {
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        ...currentImage,
        index: currentActiveIndex,
        loading: true,
        loadFailed: false,
      };
    }
    if (!image) return;

    if (image.render) {
      setImage({
        ...image,
        loading: true,
        loadFailed: false,
      } as ProviderImage);
      return;
    }

    const img: HTMLImageElement | string = await loadImage(image.src).catch(e => e);
    if (typeof img === 'string') { // error image
      image = {
        ...image,
        loading: false,
        loadFailed: true,
        src: '',
      };
      setImage(image as ProviderImage);
      return;
    }

    if (img.complete) {
      if (currentActiveIndex !== currentLoadIndex.current) return;

      const w = image?.width || defaultSize?.width || img.width;
      const h = image?.height || defaultSize?.height || img.height;

      const { width, height, left, top } = getImageSize(
        { width: w, height: h }
      );

      setImage({
        ...image,
        loading: false,
        loadFailed: false,
        width,
        height,
        top,
        left,
        imgWidth: img.width,
        imgHeight: img.height,
        src: image!.src,
      } as ProviderImage);
    }
  }

  const setToolbarSize = useCallback((size: Size) => toolbarSizeRef.current = size, []);

  const onReset = useCallback(() => {
    if (currentLoadIndex.current === -1) return;
    if (imagesRef.current[currentLoadIndex.current].render) {
      setImage(prev => ({
        ...prev,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        left: (containerSizeRef.current.width - (prev.width || 0)) / 2,
        top: (containerSizeRef.current.height - (prev.height || 0) - toolbarSizeRef.current.height) / 2,
      }));
      return;
    }
    startLoadImage(currentLoadIndex.current);
  }, []);

  const callbacks = {
    onClose,
    onPrev,
    onNext,
    onScaleX,
    onScaleY,
    onZoomIn,
    onZoomOut,
    onRotateLeft: onRotate(),
    onRotateRight: onRotate(true),
    onReset,
    onResize,
  };

  const callbackRef = useRef(callbacks);

  callbackRef.current = callbacks;

  const value = ({
    prefixCls,
    callbackRef,
    image: image as Required<CanvasLoadingImage>,
    activeIndex,
    images: imagesRef,
    setImage,
    setToolbarSize,
    getImageSize,
  });

  return (
    <ViewerContext.Provider value={value}>
      {children}
    </ViewerContext.Provider>
  );
};


function getContainerSize(container: HTMLElement | null): Size {
  return ({
    width: container?.offsetWidth || window.innerWidth,
    height: container?.offsetHeight || window.innerHeight,
  });
}

function getImageCenterPosition(image: Required<CanvasLoadingImage>): Position {
  return {
    x: image.left + image.width / 2,
    y: image.top + image.height / 2,
  };
}

function zoomProcessor(
  center: Position,
  image: Required<CanvasLoadingImage>,
  getImageSize: GetImageSize,
  props: Pick<ViewerProps, 'zoomSpeed' | 'maxScale' | 'minScale'>,
  scale: ScaleFactor,
) {
  const scaleSpeed = props.zoomSpeed || 0.3;
  const center2 = getImageCenterPosition(image);
  const offsetX = center.x - center2.x;
  const offsetY = center.y - center2.y;
  let left = 0;
  let top = 0;
  let width = 0;
  let height = 0;
  let scaleX = 0;
  let scaleY = 0;
  if (image.width === 0) {
    const {
      width: imgWidth,
      height: imgHeight,
      left: imgLeft,
      top: imgTop,
    } = getImageSize({ width: image.imgWidth, height: image.imgHeight });
    left = imgLeft;
    top = imgTop;
    width = image.width + imgWidth;
    height = image.height + imgHeight;
    scaleX = scaleY = 1;
  } else {
    const vectorX = image.scaleX > 0 ? 1 : -1;
    const vectorY = image.scaleY > 0 ? 1 : -1;
    scaleX = image.scaleX + scaleSpeed * scale * vectorX;
    scaleY = image.scaleY + scaleSpeed * scale * vectorY;
    const { maxScale = 5, minScale = 0.2 } = props;
    if (typeof maxScale !== 'undefined') {
      if (Math.abs(scaleX) > maxScale) {
        scaleX = maxScale * vectorX;
      }
      if (Math.abs(scaleY) > maxScale) {
        scaleY = maxScale * vectorY;
      }
    }
    if (Math.abs(scaleX) < minScale) {
      scaleX = minScale * vectorX;
    }
    if (Math.abs(scaleY) < minScale) {
      scaleY = minScale * vectorY;
    }
    left = image.left + (-scale) * offsetX / image.scaleY * scaleSpeed * vectorY;
    top = image.top + (-scale) * offsetY / image.scaleX * scaleSpeed * vectorX;
    width = image.width;
    height = image.height;
  }
  return {
    width,
    height,
    left,
    top,
    scaleX,
    scaleY,
    loading: false,
  };
}

export default ViewerProvider;
