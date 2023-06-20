import {useAction} from "@reatom/react"
import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import { List, Modal, Radio, RadioChangeEvent, Select } from "antd";
import { Preloader } from "../../../../../../common/preloader/Preloader";
import { POPUP_DEFAULT_WIDTH } from "../../../../../viewModel/viewData";
import styles from "./GuestsPopups.module.css"
import { useEffect } from "react";
import { filterOptions, settleGroupPopupActions, settleGroupPopupAtoms } from "../../../../../viewModel/guestsPopup/settleGroup";

const fieldStyle: React.CSSProperties = {
    width: '100%',
    fontFamily: 'var(--default-font-family)',
}

function Content() {
    const groupData = useAtomWithSelector(settleGroupPopupAtoms, x => x.groupAtom)
    const options = useAtomWithSelector(settleGroupPopupAtoms, x => x.filteredOptionsAtom)
    const filter = useAtomWithSelector(settleGroupPopupAtoms, x => x.filterAtom)
    const checkedOption = useAtomWithSelector(settleGroupPopupAtoms, x => x.checkedOptionAtom)
    const handleSetOption = useAction(settleGroupPopupActions.setCheckedOption)
    const handleSetFilter = useAction(settleGroupPopupActions.setFilter)

    const onChange = (e: RadioChangeEvent) => {
        handleSetOption(e.target.value)
    }

    return (
        <>
            <Select
                value={filter}
                onChange={handleSetFilter}
                options={filterOptions}
                style={fieldStyle}
            />
            <p>Выберите, где разместить группу <b>{groupData.name}</b></p>
            <Radio.Group onChange={onChange} value={checkedOption}>
                <List
                  className={styles.settleOptionsList}
                  bordered
                  dataSource={options}
                  renderItem={(item) => (
                    <List.Item>
                        <div className={styles.item}>
                            <Radio value={item.id}/>
                            <span className={styles.hotel}>{item.hotelName}</span>
                            <span>{item.categoryName}</span>
                        </div>
                    </List.Item>
                  )}
                />
            </Radio.Group>
        </>
    )
}

function SettleGroupPopup() {
    const popupOpened = useAtomWithSelector(settleGroupPopupAtoms, x => x.openedAtom)
    const submitLoading = useAtomWithSelector(settleGroupPopupAtoms, x => x.submitLoadingAtom)                                                                                                                                                                                                                                                                                                                                                                                     
    const loading = useAtomWithSelector(settleGroupPopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(settleGroupPopupActions.close)
    const handleSubmit = useAction(settleGroupPopupActions.submit)
    const handleGetOptions = useAction(settleGroupPopupActions.getSettleOptions)
    const groupData = useAtomWithSelector(settleGroupPopupAtoms, x => x.groupAtom)

    const onHandleSubmit = () => {
        if (!submitLoading && ! loading) {
            handleSubmit()
        }
    }

    useEffect(() => {
        if (popupOpened) {
            handleGetOptions(groupData.id)
        }
    }, [handleGetOptions, popupOpened, groupData])

    return <Modal
        title={'Разместить группу'}
        open={popupOpened}
        centered
        okText={'Разместить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: submitLoading,
            type: 'primary',
            onClick: onHandleSubmit,
        }}
        onCancel={handleClosePopup}
        width={POPUP_DEFAULT_WIDTH}
    >
        {loading
        ? <Preloader size="large" />
        : <Content />}
    </Modal>
}

export {
    SettleGroupPopup,
}