import { withRouter } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import { useAction, useAtom } from '@reatom/react';
import { initRouterHistory } from '../core/router/router';
import { ConfigProvider } from 'antd';
import ru_RU from 'antd/locale/ru_RU';
import { Preloader } from '../common/preloader/Preloader';
import { initUser, initUserLoadingAtom } from './model/currUser/currUser';
import { App } from './view/App';

const AppWrapper = withRouter(({history}) => {
  const handleInitUser = useAction(initUser)
  const initUserLoading = useAtom(initUserLoadingAtom)

  useLayoutEffect(() => {
    initRouterHistory(history)
  }, [history])

  useEffect(() => {
    handleInitUser()
  }, [handleInitUser])

  return (
    <ConfigProvider
      theme={{
          token: {
              colorPrimary: '#FE6C47',
          },
      }}
      locale={ru_RU}
    >
      {
        initUserLoading
          ? <Preloader size="large"/> 
          : <App />
      }
    </ConfigProvider>
  );
})

export {
  AppWrapper,
}
