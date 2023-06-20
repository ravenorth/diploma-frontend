import { useAction } from "@reatom/react";
import { Modal } from "antd";
import { ItemType, confirmDeletePopupActions, confirmDeletePopupAtoms } from "./confirmDelete";
import { useAtomWithSelector } from "../../core/reatom/useAtomWithSelector";
import { POPUP_DEFAULT_WIDTH } from "../../app/viewModel/viewData";

function translate(item: ItemType): string {
    switch (item) {
        case 'user':
            return 'пользователя'
        case 'guest':
            return 'гостя'
        case 'group':
            return 'группу'
        case 'hotel':
            return 'гостиницу'
        case 'event':
            return 'мероприятие'
        case 'category':
            return 'категорию'
        case 'settlement':
            return 'размещение группы'
        default:
            return ''
    }
}

function ConfirmDeletePopup() {
    const item = useAtomWithSelector(confirmDeletePopupAtoms, x => x.itemAtom)                                                                                                                                                                                                                                                                                                                                                                                         
    const popupOpened = useAtomWithSelector(confirmDeletePopupAtoms, x => x.openedAtom)
    useAtomWithSelector(confirmDeletePopupAtoms, x => x.groupAtom)
    const loading = useAtomWithSelector(confirmDeletePopupAtoms, x => x.loadingAtom)
    const handleClosePopup = useAction(confirmDeletePopupActions.close)
    const handleSubmit = useAction(confirmDeletePopupActions.submit)
    
    const onSubmit = () => {
        if (!loading) {
            handleSubmit()
        }
    }

    return <Modal
        title={`Удалить ${translate(item)}`}
        open={popupOpened}
        centered
        okText={'Удалить'}
        cancelText={'Отмена'}
        okButtonProps={{
            loading: loading,
            type: 'primary',
            onClick: onSubmit,
        }}
        onCancel={handleClosePopup}
        width={POPUP_DEFAULT_WIDTH}
    >
        <span>
            {`Вы действительно хотите безвозвратно удалить ${translate(item)}?`}
        </span>
    </Modal>
}

export {
    ConfirmDeletePopup,
}