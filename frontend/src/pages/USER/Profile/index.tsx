import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderUserProfile = lazy(() => import('../../../components/USER/Profile'));
const MemoizedUserProfile = memo(RenderUserProfile);

export default function UserProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Identity Hub | User</title>
      </Helmet>

      <LayoutWrapper activePage="Profile">
        <LazyLoadingWrapper>
          <MemoizedUserProfile />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}