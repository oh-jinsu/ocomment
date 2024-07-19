"use client";

import { MouseEventHandler } from "react";
import SubmitButton from "../submit_button";

type Props = {
    id: string;
};

export default function WebsitePage({ id }: Props) {
    const script = `<div id="ocomment-root" data-website-id="${id}"></div>\n<script src="${process.env.NEXT_PUBLIC_ORIGIN}/ocomment.js" defer></script>`;

    const onClick: MouseEventHandler = (e) => {
        e.preventDefault();

        navigator.clipboard.writeText(script);
    };

    return (
        <main>
            <p className="text-center">아래 코드를 웹사이트에 붙여 넣으세요.</p>
            <pre className="bg-gray-100 p-4 rounded-md my-4 overflow-x-auto">{script}</pre>
            <SubmitButton onClick={onClick}>코드 복사하기</SubmitButton>
        </main>
    );
}
