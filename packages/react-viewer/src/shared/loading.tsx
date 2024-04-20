import React from 'react';

const Loading = ({
  prefixCls
}: {
  prefixCls: string;
}) => {
  return (
    <div className={`${prefixCls}-node-loading-wrapper`}>
      <div className={`${prefixCls}-node-loading`}>
        <i className='line'></i>
        <i className='dash'></i>
      </div>
    </div>
  );
};

export default Loading;
