import { Tag } from "antd";

type StubProps = {
    text: string,
}

function Stub({
    text,
}: StubProps) {
    return <Tag color={'default'}>{text}</Tag>
}

export {
    Stub,
}