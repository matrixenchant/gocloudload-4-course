import { Select, SelectItem } from '@nextui-org/react';
import { FC } from 'react';
import { EditModalInput } from './EditModal';

const StatusSelect: FC<EditModalInput> = ({ value, onChange }) => {
  return (
    <Select label="Status" selectedKeys={[value]} onChange={(e) => onChange(e.target.value)}>
      {['idle', 'active', 'finished'].map((status) => (
        <SelectItem key={status}>{status.toLocaleUpperCase()}</SelectItem>
      ))}
    </Select>
  );
};

export default StatusSelect;
