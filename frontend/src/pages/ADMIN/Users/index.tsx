import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

// Point this to your existing UserManagement component
const RenderUserManagement = lazy(() => import('../../../components/ADMIN/UserManagement'));
const MemoizedUserManagement = memo(RenderUserManagement);

export default function AdminUsersPage() {
  return (
    <>
      <Helmet>
        <title>User Management | Admin</title>
      </Helmet>

      <LayoutWrapper activePage="User Management">
        <LazyLoadingWrapper>
          <MemoizedUserManagement />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}