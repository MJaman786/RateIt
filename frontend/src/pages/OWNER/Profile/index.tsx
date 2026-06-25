import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderOwnerProfile = lazy(() => import('../../../components/OWNER/Profile'));
const MemoizedOwnerProfile = memo(RenderOwnerProfile);

export default function OwnerProfilePage() {
  return (
    <>
      <Helmet>
        <title>Store Metrics Profile | Owner</title>
      </Helmet>

      <LayoutWrapper activePage="Profile">
        <LazyLoadingWrapper>
          <MemoizedOwnerProfile />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}