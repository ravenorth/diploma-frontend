import {useAction} from "@reatom/react"
import { FieldBlock, fieldStyle } from "../../../../../../common/popupFieldBlock/FieldBlock";
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { Form, FormInstance, Input, InputNumber, Modal, Select, Table } from "antd";
import { Preloader } from "../../../../../../common/preloader/Preloader";
import { getCategoryTypeAsSelectOptions } from "../../../../../model/hotels/categoryData";
import { numberToStringMoney } from "../../../../../../core/money/money";
import { getStringDateArr } from "../../../../../../core/time/time";
import styles from '../HotelsLayout.module.css'
import { EditableCell } from "../../../../../../common/tableComponents/EditableCell";
import { useMemo } from "react";
import { Toasts } from "../../../../../../common/toasts/toasts";
import { updateCategoryPopupActions, updateCategoryPopupAtoms } from "../../../../../viewModel/hotelsPopup/updateCategory";
import { eventsAtoms } from "../../../../../model/events/events";

function NameInput() {
    const name = useAtomWithSelector(updateCategoryPopupAtoms, x => x.nameAtom)
    const nameError = useAtomWithSelector(updateCategoryPopupAtoms, x => x.nameErrorAtom)
    const handleSetFullName = useAction(updateCategoryPopupActions.setName)
    const mode = useAtomWithSelector(updateCategoryPopupAtoms, x => x.popupModeAtom)  

    return <Input
        value={name}
        status={nameError ? 'error' : ''}
        onChange={e => handleSetFullName(e.target.value)}
        style={fieldStyle}
        disabled={mode === 'edit'} //!
    />
}

function TypeInput() {
    const category = useAtomWithSelector(updateCategoryPopupAtoms, x => x.typeAtom)
    const handleSetCategory = useAction(updateCategoryPopupActions.setType)

    return <Select
        value={category}
        onChange={handleSetCategory}
        options={getCategoryTypeAsSelectOptions()}
        style={fieldStyle}
    />
}

function CapacityInput() {
    const capacity = useAtomWithSelector(updateCategoryPopupAtoms, x => x.capacityAtom)
    const handleSetCapacity = useAction(updateCategoryPopupActions.setCapacity)

    return <InputNumber
        min={1}
        value={capacity}
        onChange={(value: number | null) => handleSetCapacity(value || 0)}
        style={fieldStyle}
    />
}

function remapToTableData(slots: number[], eventDates: string[]): Object[] {
    let item: any = {}
    for (let i = 0; i < eventDates.length; i++) {
        item[`slot${i}`] = slots.length ? slots[i] : 0
    }
    return [{
        ...item,
        key: 0,
    }]
}

function remapRowToSlots(row: Object[]): number[] {
    let res: number[] = []
    for (let i = 0; i < Object.keys(row).length; i++) {
        const item = row[`slot${i}` as keyof Object] as unknown as number
        res.push(item)
    }
    return res
}

type AmountInputTableProps = {
    form: FormInstance<any>,
}

function AmountInputTable({
    form
}: AmountInputTableProps) {
    const currEvent = useAtomWithSelector(eventsAtoms, x => x.currEventAtom)
    const eventDates = useMemo(() => getStringDateArr(currEvent.start, currEvent.end), [currEvent])
    
    const slots = useAtomWithSelector(updateCategoryPopupAtoms, x => x.slotsAtom)

    const dataSource = remapToTableData(slots, eventDates)

    form.setFieldsValue({ ...dataSource[0] })

    let columns = []
    for (let i = 0; i < eventDates.length; i++) {
        const key = `slot${i}`
        columns.push({
            title: eventDates[i],
            dataIndex: key,
            key,
            width: 65,
        } as any)
    }

    const mergedColumns = columns.map((col) => {
        return {
          ...col,
          onCell: (record: any) => ({
            record,
            input: {type: 'number'},
            dataIndex: col.dataIndex,
            title: col.title,
            editing: true,
          }),
        };
    });

    return <Form form={form} component={false} validateTrigger={[]}>
        <div style={{width: '100%', overflowX: 'auto'}}>
            <Table
                components={{
                    body: {
                      cell: EditableCell,
                    },
                }}
                bordered
                tableLayout={'fixed'}
                rowClassName={() => styles.tableCell}
                dataSource={dataSource}
                columns={mergedColumns as any}
                pagination={false}
                size="middle"
            />
        </div>
    </Form>
}

function PriceInput() {
    const price = useAtomWithSelector(updateCategoryPopupAtoms, x => x.priceAtom)
    const handleSetPrice = useAction(updateCategoryPopupActions.setPrice)

    return <InputNumber
        prefix="₽"
        min={0}
        value={price}
        onChange={(value: number | null) => handleSetPrice(value || 0)}
        formatter={(value) => numberToStringMoney(value || 0)}
        parser={(value) => +value!.replace('.', '')}
        style={fieldStyle}
    />
}

function Content({
    form
}: AmountInputTableProps) {
    const nameError = useAtomWithSelector(updateCategoryPopupAtoms, x => x.nameErrorAtom)

    return (
        <>
            <FieldBlock
                title={'Название'}
                content={<NameInput/>}
                error={nameError}
            />
            <FieldBlock
                title={'Тип'}
                content={<TypeInput/>}
            />
            <FieldBlock
                title={'Кол-во человек в номере'}
                content={<CapacityInput/>}
            />
            <AmountInputTable
                form={form}
            />
            <FieldBlock
                title={'Цена за сутки'}
                content={<PriceInput/>}
            />
        </>
    )
}

function UpdateCategoryPopup() {
    const popupOpened = useAtomWithSelector(updateCategoryPopupAtoms, x => x.openedAtom)
    const mode = useAtomWithSelector(updateCategoryPopupAtoms, x => x.popupModeAtom)                                                                                                                                                                                                                                                                                                                                                                                   
    const loading = useAtomWithSelector(updateCategoryPopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(updateCategoryPopupActions.close)
    const handleSubmit = useAction(updateCategoryPopupActions.submit)
    const handleSetSlots = useAction(updateCategoryPopupActions.setSlots)

    const [form] = Form.useForm()

    const onHandleSubmit = async () => {
        if (!loading) {
            try {
                const row = await form.validateFields()
                handleSetSlots(remapRowToSlots(row))
                handleSubmit()
            } catch (err) {
                Toasts.error('Не удалось изменить категорию')
            }
        }
    }

    return <Modal
        title={`${(mode === 'create') ? 'Добавить': 'Редактировать'} категорию`}
        open={popupOpened}
        centered
        okText={'Сохранить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: loading,
            type: 'primary',
            onClick: onHandleSubmit,
        }}
        onCancel={handleClosePopup}
        width={700}
    >
        {loading
        ? <Preloader size="large" />
        : <Content form={form} />}
    </Modal>
}

export {
    UpdateCategoryPopup,
}