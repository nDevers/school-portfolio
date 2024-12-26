import swagger from '@/lib/swagger';
import ReactSwagger from '@/app/api-doc/ReactSwagger';

export default async function ApiDocPage() {
    const spec = await swagger();

    return (
        <section>
            <ReactSwagger spec={spec} />
        </section>
    );
}
