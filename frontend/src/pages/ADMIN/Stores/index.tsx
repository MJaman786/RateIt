import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderStoreManagement = lazy(() => import('../../../components/ADMIN/StoreManagement')); // Change path once created
const MemoizedStoreManagement = memo(RenderStoreManagement);

export default function AdminStoresPage() {
  return (
    <>
      <Helmet>
        <title>Store Management | Admin</title>
      </Helmet>

      <LayoutWrapper activePage="Store Management">
        <LazyLoadingWrapper>
          <MemoizedStoreManagement />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}