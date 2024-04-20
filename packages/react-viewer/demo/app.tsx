import React, { useEffect, useRef, useState } from 'react';
import { Leva, useControls } from 'leva';
import type { Language } from '../src/i18n/i18n-context';

import { N3bulaViewer, useViewerState } from '../src/index';
import '../src/style.scss';
import RegistryProvider, { ViewerNode, RegistryProviderRef } from '../src/registry/registry-provider';
import { useSSR } from '../src/hooks/use-ssr';
// import { N3bulaViewer, useViewerState } from '../dist/index';
// import '../dist/style.css';

const images = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.png',
  '5.jpg',
  '6.jpg',
  '7.gif',
  '8.jpg',
  '9.jpg',
  '10.png',
  '11.png',
  '12.jpg',
];

const App = () => {
  const { isOpen, onOpen, onClose } = useViewerState();
  const [disabled, setDisabled] = useState(false);
  const [state, set] = useControls(() => ({
    language: {
      options: {
        zh: 'zh',
        en: 'en',
      }
    },
    flipable: true,
    zoomable: {
      value: true, onChange(value) {
        if (!value) {
          set({ scrollZoom: false });
        } else {
          set({ scrollZoom: true });
        }
        setDisabled(!value);
      },
    },
    rotatable: true,
    changeable: true,
    scrollZoom: {
      value: true,
      disabled
    },
  }), [disabled]);

  const leva = (
    <Leva titleBar={{
      position: { x: -50, y: 100 },
      drag: false
    }} />
  );

  const { isServer } = useSSR();
  const [page, setPage] = useState(false);
  const registryRef = useRef<RegistryProviderRef>(null);

  useEffect(() => {
    if (isServer) return;
    registryRef.current?.register();
  }, [isServer]);

  return (
    <>
      <button type="button" onClick={() => {
        setPage(prev => !prev);
        registryRef.current?.unregister();
        registryRef.current?.register();
      }}>Switch page</button>

      <button type='button' onClick={onOpen}>Open</button>
      <N3bulaViewer
        open={isOpen}
        lang={state.language as Language}
        flipable={state.flipable}
        zoomable={!disabled}
        rotatable={state.rotatable}
        changeable={state.changeable}
        scrollZoom={state.scrollZoom}
        images={[
          {
            src: 'images/7.gif',
          },
          {
            rotate: 45,
            src: 'images/1.jpg',
            info: 'This is him.',
          },
          {
            src: 'images/2.jpg',
            info: () => (
              <div style={{ color: 'pink' }}>
                This is her.
              </div>
            ),
          },
          {
            key: 'custom node',
            render: () => (
              <div>
                custom node
              </div>
            )
          },
        ]}
        onClose={onClose}
      // onChange={(activeImage, activeIndex) => {
      // console.log('activeImage, activeIndex :>>', activeImage, activeIndex);
      // }}
      />

      <RegistryProvider ref={registryRef}>
        {leva}

        <N3bulaViewer
          // open={isOpen}
          lang={state.language as Language}
          flipable={state.flipable}
          zoomable={!disabled}
          rotatable={state.rotatable}
          changeable={state.changeable}
          scrollZoom={state.scrollZoom}
          // images={[
          // {
          //   src: 'images/7.gif',
          // },
          // {
          //   rotate: 45,
          //   src: 'images/1.jpg',
          //   info: 'This is him.',
          // },
          // {
          //   src: 'images/2.jpg',
          //   info: () => (
          //     <div style={{ color: 'pink' }}>
          //       This is her.
          //     </div>
          //   ),
          // },
          // {
          //   render: () => (
          //     <div>
          //       custom node
          //     </div>
          //   )
          // },
          // ]}
          onClose={onClose}
        // onChange={(activeImage, activeIndex) => {
        // console.log('activeImage, activeIndex :>>', activeImage, activeIndex);
        // }}
        />


        {page ? (
          <>
            <ViewerNode vKey='uniqueKey1'>
              <div style={{ width: '200px', height: '400px', transform: 'rotate(45deg)', cursor: 'pointer' }}>
                <div>I'm a custom node1</div>
                <div>I'm a custom node2</div>
              </div>
            </ViewerNode>
            <ViewerNode vKey='uniqueKey2'>
              <>
                <div>I'm a custom node3</div>
                <div>I'm a custom node4</div>
              </>
            </ViewerNode>
            <ViewerNode vKey='uniqueKey3'>
              <>
                <div>I'm a custom node5</div>
                <div>I'm a custom node6</div>
              </>
            </ViewerNode>
          </>
        ) : (
          <>
            <div style={{ width: 700, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', rowGap: '1rem' }}>
              {images.map((path, index) => (
                <img className={index === 3 ? 'no-register' : ''} key={index} src={`images/${path}`} alt={path} width={100} height={100} style={{ objectFit: 'cover', objectPosition: 'center', cursor: 'pointer' }} />
              ))}
            </div>

            <ViewerNode vKey='uniqueKey'>
              <>
                <div>I'm a custom node</div>
                <div>I'm a custom node</div>
              </>
            </ViewerNode>
          </>
        )}
      </RegistryProvider>
    </>
  );
};

export default App;
