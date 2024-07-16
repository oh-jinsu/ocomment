import FormInput from "@/frontend/components/form/input";
import FormLabel from "@/frontend/components/form/label";
import { inputStyle } from "@/frontend/styles";
import SubmitButton from "@/frontend/submit_button";

export default function Home() {
    return (
        <form>
            <FormLabel>웹사이트 이름</FormLabel>
            <FormInput name="name" type="text" placeholder="website" className={inputStyle}></FormInput>
            <SubmitButton>댓글 섹션 생성하기</SubmitButton>
        </form>
    );
}
