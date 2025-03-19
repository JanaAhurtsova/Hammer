import { memo } from 'react';
import PropTypes from "prop-types";
import { Image } from 'antd';

const Option = ({item, onSelect}) => {
  return (
    <div className='d-flex flex-column align-items-center' style={{width: '100px'}}>
      <Image height={60} preview={false} src={item.src} alt={item.title} onClick={onSelect} />
      <span className='text-center'>{item.title}</span>
    </div>
)}

Option.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func,
}

export default memo(Option);