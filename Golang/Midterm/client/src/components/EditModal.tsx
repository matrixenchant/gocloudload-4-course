import { api } from '@/utils';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { AxiosResponse } from 'axios';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export interface EditModalInput {
  value: string;
  onChange: (val: string) => void;
}

type ModalInputsRecords<T> = {
  [K in keyof T]?: FC<EditModalInput>;
};

interface IProps<T> {
  data: Partial<T & { id: number }> | null;
  onClose: () => void;
  name: string;
  fields: (keyof T)[];
  onSubmited: () => void;
  inputs?: ModalInputsRecords<T>;
}

const getInit = <T,>(data: Partial<T & { id: number }> | null, fields: (keyof T)[]) => {
  return fields.reduce((prev, curr) => ({ ...prev, [curr]: data ? data[curr] : '' }), {}) as T;
};

const call = (Base: FC, props: any) => <Base {...props} />;

const EditModal = <T,>({ name, data, onClose, fields, onSubmited, inputs = {} }: IProps<T>) => {
  const isOpen = !!data;
  const state = data?.id ? 'edit' : 'new';
  const [item, setItem] = useState(getInit(data, fields));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItem(getInit(data, fields));
  }, [data, fields]);

  const onSubmitHandler = async () => {
    setLoading(true);
    try {
      let res: AxiosResponse;

      if (state === 'edit') {
        res = await api.put(`${name}/${data?.id}`, item);
      } else {
        res = await api.post(`${name}`, item);
      }

      console.log(res.data);

      onSubmited();
      onClose();
    } catch (e: any) {
      toast.error(e.message.toString());
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteHandler = async () => {
    setLoading(true);
    try {
      let res: AxiosResponse;

      res = await api.delete(`${name}/${data?.id}`);

      console.log(res.data);

      onSubmited();
      onClose();
    } catch (e: any) {
      toast.error(e.message.toString());
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {state === 'edit' && 'Edit record'}
          {state === 'new' && 'New record'}
        </ModalHeader>
        <ModalBody>
          {fields.map((key) => {
            const value = item[key] as string;

            return inputs && inputs[key] ? (
              inputs[key]({ value, onChange: (val) => setItem({ ...item, [key]: val }) })
            ) : (
              <Input
                key={key as string}
                label={key.toString().toUpperCase()}
                name={key.toString()}
                value={value}
                onChange={(e) => setItem({ ...item, [key]: e.target.value })}
              />
            );
          })}
        </ModalBody>
        <ModalFooter>
          {state === 'edit' && (
            <Button onClick={onDeleteHandler} color="danger">
              Delete
            </Button>
          )}
          <Button onClick={onSubmitHandler} isLoading={loading}>
            {state === 'edit' && 'Save'}
            {state === 'new' && 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
