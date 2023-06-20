import { useAtom } from '@reatom/react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styles from "./MainLayout.module.css"
import { Sidebar } from './sidebar/Sidebar';
import { UpdatePasswordPopup } from './header/popups/UpdatePasswordPopup';
import { RowContextMenu } from '../../../common/tableComponents/RowContextMenu';
import { ConfirmDeletePopup } from '../../../common/confirmPopup/ConfirmDeletePopup';
import { UpdateUserPopup } from './layouts/users/popups/UpdateUserPopup';
import { UpdateGroupPopup } from './layouts/guests/popups/UpdateGroupPopup';
import { UpdateHotelInfoPopup } from './layouts/hotels/popups/UpdateHotelInfoPopup';
import { UpdateGuestPopup } from './layouts/guests/popups/UpdateGuestPopup';
import { UpdateEventPopup } from './layouts/events/popups/UpdateEventPopup';
import { UpdateCategoryPopup } from './layouts/hotels/popups/UpdateCategoryPopup';
import { SettleGroupPopup } from './layouts/guests/popups/SettleGroupPopup';
import { currUserAtom } from '../../model/currUser/currUser';
import { Router, adminRoutes, hotelRoutes, managerRoutes } from '../../../core/router/router';
import { MainHeader } from './header/MainHeader';

function PopupsLayout() {
    return (
        <>
            <RowContextMenu />
            <ConfirmDeletePopup />
            <UpdatePasswordPopup />
            <UpdateUserPopup />
            <UpdateGroupPopup />
            <UpdateGuestPopup />
            <UpdateHotelInfoPopup />
            <UpdateEventPopup />
            <UpdateCategoryPopup />
            <SettleGroupPopup />
        </>
    )
}

function MainLayout() {                                                                                                                                                                                                                                                                                                                                                                                          
    const currUser = useAtom(currUserAtom)

    if (!currUser) {
        return <Redirect to={Router.Auth.url()} />
    }

    return (
        <div className={styles.layout}>
            <MainHeader />
            <div className={styles.contentRow}>
                {currUser.role !== 'hotel' && <Sidebar/>}
                <div className={styles.content}>
                    <Switch>
                        {currUser.role === 'admin'
                        ? adminRoutes.map(route =>
                            <Route key={route.path} exact path={[route.path]} component={route.component}/>
                        )
                        : currUser.role === 'manager' || currUser.role === 'senior manager'
                        ? managerRoutes.map(route =>
                            <Route key={route.path} exact path={[route.path]} component={route.component}/>
                        )
                        : hotelRoutes.map(route =>
                            <Route key={route.path} exact path={[route.path]} component={route.component}/>
                        )}

                        {currUser.role === 'hotel'
                        ? <Redirect to={Router.Hotels.url()}/>
                        : <Redirect to={Router.Events.url()}/>}
                    </Switch>
                </div>
            </div>
            <PopupsLayout />
        </div>
    )
}

export {
    MainLayout,
}