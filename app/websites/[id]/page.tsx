type Props = {
    params: {
        id: string;
    }
}

export default function Page({ params }: Props) {
    return <h1 className="text-center">
        {params.id}
    </h1>
}
