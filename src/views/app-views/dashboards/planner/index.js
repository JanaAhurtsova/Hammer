import { useState } from 'react'
import Option from './components/option.js';
import PlannerBoard from './components/board.js';
import { defaultOptions } from './constant.js';
import { Card } from 'antd';

const PlannerView = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      <div className='d-flex justify-content-around code-box' style={{padding: '20px', gap: '15px'}}>
        {defaultOptions.map((item) => (
          <Option key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
        ))}
      </div>
      <Card>Выберите элемент, затем кликните по пустой области внизу для отрисовки элемента</Card>
      <PlannerBoard currentOption={selectedItem} />
    </div>
  )
}

export default PlannerView