import React from "react";
import styles from './FieldBlock.module.css'

const fieldStyle: React.CSSProperties = {
    width: 300,
    fontFamily: 'var(--default-font-family)',
}

type FieldBlockProps = {
    title: string,
    content: JSX.Element,
    error?: string,
}

function FieldBlock({
    title,
    content,
    error = '',
}: FieldBlockProps) {
    const errorFlag: boolean = !!error
    return (
        <div className={styles.blockContainer}>
            <div className={styles.secondContainer}>
                <span className={styles.blockTitle}>{title}</span>
                <div className={styles.blockContent}>{content}</div>
            </div>
            {errorFlag && <div className={styles.errorMessage}>
                {error}
            </div>}
        </div>
    )
}

export {
    fieldStyle,
    FieldBlock,
}