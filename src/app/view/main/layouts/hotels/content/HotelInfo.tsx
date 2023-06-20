import { useAtomWithSelector } from "../../../../../../core/reatom/useAtomWithSelector";
import styles from './HotelInfo.module.css'
import { Button, Collapse, Dropdown, MenuProps } from "antd";
import { SettingOutlined, CaretRightOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAction, useAtom } from "@reatom/react";
import { confirmDeletePopupActions } from "../../../../../../common/confirmPopup/confirmDelete";
import { currUserAtom } from "../../../../../model/currUser/currUser";
import { remapHMToString } from "../../../../../../core/time/time";
import { Stub } from "../../../../../../common/stub/Stub";
import { hotelAtoms } from "../../../../../model/hotels/hotels";
import { updateHotelInfoPopupActions } from "../../../../../viewModel/hotelsPopup/updateHotelInfo";

const { Panel } = Collapse;

const iconStyle: React.CSSProperties = {
    fontSize: 16,
    color: 'var(--default-font-family)',
    marginBottom: 7,
}

const expandIconStyle: React.CSSProperties = {
    fontSize: 16,
    color: 'var(--default-font-family)',
    marginTop: 12,
}

const width: React.CSSProperties = {
    width: 'var(--middle-width)',
}

const menuButton = (menuItems: any) => {
    const menuProps = {
        items: menuItems,
    }
    return (
        <Dropdown menu={menuProps} trigger={['click']}>
            <Button
                style={iconStyle}
                type="text"
                icon={<SettingOutlined />}
                onClick={(e) => e.stopPropagation()}
            />
        </Dropdown>
    )
}

function HotelInfo() {
    const currUser = useAtom(currUserAtom)
    const currHotelData = useAtomWithSelector(hotelAtoms, x => x.currHotelAtom)

    const handleOpenEditHotelInfoPopup = useAction(updateHotelInfoPopupActions.open)
    const handleOpenDeletePopup = useAction(confirmDeletePopupActions.open)

    const menuItems: MenuProps['items'] = [
        {
            key: '0',
            label: 'Редактировать данные',
            icon: <EditOutlined />,
            onClick: (e) => {
                e.domEvent.stopPropagation()
                handleOpenEditHotelInfoPopup({
                    mode: 'edit',
                    data: currHotelData,
                })
            },
        },
    ]

    if (currUser?.role === 'admin') {
        menuItems.push({
            key: '1',
            label: 'Удалить гостиницу',
            icon: <DeleteOutlined />,
            onClick: (e) => {
                e.domEvent.stopPropagation()
                handleOpenDeletePopup({
                    item: 'hotel',
                    id: currHotelData.id,
                })
            },
        })
    }

    return (
        <div className={styles.wrapper}>
            <Collapse ghost
                style={width}
                expandIcon={({ isActive }: any) => 
                    <CaretRightOutlined style={expandIconStyle} rotate={isActive ? 90 : 0} />
                }
            >
                <Panel key="1"
                    className={styles.header}
                    header={currHotelData.name}
                    extra={(currUser?.role === 'admin' || currUser?.role === 'hotel') && menuButton(menuItems)}
                >
                    <div className={styles.content}>
                        <div className={styles.subContent}>
                            <div className={styles.subHeader}>Общая информация</div>
                            <div>{`Время заезда с ${remapHMToString(currHotelData.checkin)}`}</div>
                            <div>{`Время выезда до ${remapHMToString(currHotelData.checkout)}`}</div>
                            <p></p>
                            <div>Условия отмены:</div>
                                {currHotelData.cancelCondition
                                    ? <span className={styles.longText}>{currHotelData.cancelCondition}</span>
                                    : <Stub text={'Не указаны'}/>
                                }
                        </div>
                        <div className={styles.subContent}>
                            <div className={styles.subHeader}>Контакты</div>
                            <div>
                                {'Телефон: '}
                                {currHotelData.phone
                                    ? <>{currHotelData.phone}</>
                                    : <Stub text={'Не указан'}/>
                                }
                            </div>
                            <div>
                                {'Email: '}
                                {currHotelData.email
                                    ? <>{currHotelData.email}</>
                                    : <Stub text={'Не указан'}/>
                                }
                            </div>
                            <div>
                                {'Ссылка: '}
                                {currHotelData.link
                                    ? <a href={currHotelData.link}>{currHotelData.link}</a>
                                    : <Stub text={'Не указана'}/>
                                }
                            </div>
                        </div>
                        {currUser?.role !== 'hotel' && <>
                            <div className={styles.subContent}>
                                <div className={styles.subHeader}>Менеджеры</div>
                                {currHotelData.managerUsers?.length > 0
                                    ? currHotelData.managerUsers.map(user => (
                                        <div key={user.id}>{user.fullName}</div>
                                    ))
                                    : <Stub text={'Не назначены'}/>
                                }
                            </div>
                            <div className={styles.subContent}>
                                <div className={styles.subHeader}>Представитель отеля</div>
                                <div>{currHotelData.hotelUser 
                                    ? currHotelData.hotelUser.fullName
                                    : <Stub text={'Не назначен'}/>
                                }</div>
                            </div>
                        </>}
                    </div>
                </Panel>
            </Collapse>
        </div>
    )
}

export {
    HotelInfo,
}