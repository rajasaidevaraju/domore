export const dynamic = 'force-dynamic';

import AltHomePage from '@/app/files/page';

const getParams = async (): Promise<{ [key: string]: string | undefined }> => {
  return { page: '1' };
};

export default function Home() {
  const params = getParams();  
  
  return <AltHomePage searchParams={params} />;
}
