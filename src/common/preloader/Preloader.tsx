import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import styles from './Preloader.module.css'

type PreloaderSize = 'small' | 'normal' | 'large'

type PreloaderProps = {
    size?: PreloaderSize,
    style?: React.CSSProperties,
}

function getPreloaderFontSize(size: PreloaderSize): number {
    return getValueByCheckedKey(size, {
        'small': 15,
        'normal': 25,
        'large': 40,
    })
}

function getValueByCheckedKey<T>(key: string | number, map: {[items: string]: T}) {
    if (!map.hasOwnProperty(key)) {
        throw new Error(`getValueByCheckedKey(${key})`)
    }
    return map[key]
}

const Preloader: React.FC<PreloaderProps> = ({
    size = 'normal',
    style = {}
}) => {
    const antIcon = <LoadingOutlined
        style={{ fontSize: getPreloaderFontSize(size) }}
        spin 
    />;

    return (
        <Spin indicator={antIcon} className={styles.preloader} style={style} />
    )
}

export {
    Preloader,
}