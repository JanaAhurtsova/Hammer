import React, { useRef, useEffect, useMemo, memo } from 'react';
import Core from '../core';
import { Button, Space } from 'antd';

const PlannerBoard = ({ currentOption }) => {
  const rootRef = useRef(null);
  const fileRef = useRef(null);
  const core = useMemo(() => new Core(), []);

  useEffect(() => {
    if(rootRef.current) {
      core.mount(rootRef.current);
    }
    return () => core.unmount();
  }, [core]);
  
  useEffect(() => {
    core.changeOption(currentOption);
  }, [core, currentOption])

  const uploadFile = () => {
    fileRef.current.click();
  }

  return (
    <div className="d-flex flex-column">
      <div ref={rootRef} className='code-box' style={{overflow: 'hidden'}} />

      <Space>
        <Button type='primary' onClick={() => core.onClear()}>Clear all</Button>
        <Button type='primary' onClick={() => core.onSave()}>Save</Button>
        <div>
          <input ref={fileRef} className='d-none' type="file" onChange={(e) => core.onLoad(e)} accept=".json" />
          <Button type='primary' onClick={uploadFile}>Upload file</Button>
        </div>
      </Space>
    </div>
  );
};

export default memo(PlannerBoard);
