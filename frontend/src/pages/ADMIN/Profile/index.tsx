import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderAdminProfile = lazy(() => import('../../../components/ADMIN/Profile')); // Change path once created
const MemoizedAdminProfile = memo(RenderAdminProfile);

export default function AdminProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Profile | Admin</title>
      </Helmet>

      <LayoutWrapper activePage="Profile">
        <LazyLoadingWrapper>
          <MemoizedAdminProfile />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}