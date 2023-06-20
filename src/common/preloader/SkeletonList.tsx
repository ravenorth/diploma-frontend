import { Skeleton } from "antd"
import { CSSProperties } from "react"

const style: CSSProperties = {
    height: 40,
    width: 186,
    margin: 4,
}

const count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function SkeltonList() {
    return (
        <>
            {count.map(i => <Skeleton.Input key={i} style={style} active />)}
        </>
    )
}

export {
    SkeltonList
}