import WebsitePage from "@/frontend/components/website_page";

type Props = {
    params: {
        id: string;
    };
};

export default function Page({ params }: Props) {
    return <WebsitePage id={params.id} />;
}
