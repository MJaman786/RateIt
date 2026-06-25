import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderUserStores = lazy(() => import('../../../components/USER/StoreDiscovery'));
const MemoizedUserStores = memo(RenderUserStores);

export default function UserStoresPage() {
  return (
    <>
      <Helmet>
        <title>Discover Stores | User</title>
      </Helmet>

      <LayoutWrapper activePage="Stores">
        <LazyLoadingWrapper>
          <MemoizedUserStores />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}