import { Form, Input, InputNumber, Select } from "antd";
import { SelectOption } from "../../app/viewModel/viewData";

type EditableCellValue = string | number
type EditableCellValidator = (value: EditableCellValue) => string

type EditableCellInput = {
  type: 'text' | 'number',
} | {
  type: 'select',
  options: SelectOption[],
}

function getError(cellValidator: (value: EditableCellValue) => string, value: EditableCellValue): Promise<string> {
  const error = cellValidator(value)
  return error ? Promise.reject(new Error(error)) : Promise.resolve('')
}

function getInputNode(input: EditableCellInput, width: number | string): React.ReactNode {
  if (input) {
    switch (input.type) {
      case 'number':
        return <InputNumber min={0} style={{width: width}} />
      case 'select':
        return <Select options={input.options} style={{width: width}} />
      case 'text':
        return <Input style={{width: width}} />
    }
  }

  return <></>
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    input: EditableCellInput;
    record: Object;
    index: number;
    children: React.ReactNode;
    width?: number | string;
    cellValidator?: (value: EditableCellValue) => string;
    value: EditableCellValue,
}
  
const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    input,
    record,
    index,
    children,
    width = '100%',
    cellValidator,
    ...restProps
}) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                validator: (_, value) => cellValidator
                  ? getError(cellValidator, value)
                  : Promise.resolve(''),
              }
            ]}
          >
            {getInputNode(input, width)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
};

export {
  EditableCell,
}

export type {
  EditableCellValidator,
}