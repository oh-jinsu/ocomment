import { inputStyle, labelStyle } from "@/frontend/styles";
import SubmitButton from "@/frontend/submit_button";

export default function Home() {
    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-3xl font-bold text-center my-4">Ocomment</h1>
            <p className="text-center">웹사이트에 댓글 섹션을 쉽고 빠르게 추가해 보세요.</p>
            <form className="mt-8">
                <label className={labelStyle}>웹사이트 이름</label>
                <input name="name" type="text" placeholder="website" className={inputStyle}></input>
                <SubmitButton className="mt-4 w-full">댓글 섹션 생성하기</SubmitButton>
            </form>
            <footer>
                <p className="text-center mt-8 text-sm">© {new Date().getFullYear()} Jinsu Oh. All rights reserved.</p>
            </footer>
        </main>
    );
}
