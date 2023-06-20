import { Button, Input, InputRef, Space } from "antd";
import { ColumnType } from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const ColumnSearch = <T, K extends keyof T>(dataIndex: K): ColumnType<T> => {
    const [, setSearchText] = useState('');
    const [, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: K,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex as ('string | number | symbol'));
    };
  
    const handleReset = (
      clearFilters: () => void, 
      confirm: (param?: FilterConfirmProps) => void, 
      dataIndex: K
    ) => {
      clearFilters();
      setSearchText('');
      confirm();
      setSearchText('');
      setSearchedColumn(dataIndex as ('string | number | symbol'));
    }

    return ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
              <Input
                ref={searchInput}
                placeholder={'Поиск...'}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                style={{ marginBottom: 8, display: 'block' }}
              />
              <Space>
                <Button
                  onClick={() => clearFilters && handleReset(clearFilters, confirm, dataIndex)}
                  size="small"
                  style={{ width: 90 }}
                >
                  Сбросить
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Найти
                </Button>
              </Space>
            </div>
          ),
          filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#FE6C47' : undefined, fontSize: 15 }} />
          ),
          onFilter: (value, record) =>
            (record[dataIndex] as string)
              .toLowerCase()
              .includes((value as string).toLowerCase()),
          onFilterDropdownOpenChange: (visible) => {
            if (visible) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
          render: (text) => text
        }
    )
}

export {
    ColumnSearch,
}