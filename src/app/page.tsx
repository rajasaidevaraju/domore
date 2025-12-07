export const dynamic = 'force-dynamic';

import { HomeSearchParams } from '@/app/types/Types';
import AltHomePage from '@/app/files/page';

export default function Home({searchParams}: {searchParams:HomeSearchParams}) {
  return <AltHomePage searchParams={searchParams}/>;
}
