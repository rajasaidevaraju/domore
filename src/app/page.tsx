import AltHomePage from '@/app/files/page';
import { HomeProps } from '@/app/types/Types';

const getParams = async (): Promise<{ [key: string]: string | undefined }> => {
  return { page: '1' };
};

export default function Home() {
  const params = getParams();  
  
  return <AltHomePage searchParams={params} />;
}
