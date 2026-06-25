import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderAdminRatings = lazy(() => import('../../../components/ADMIN/Ratings')); // Change path once created
const MemoizedAdminRatings = memo(RenderAdminRatings);

export default function AdminRatingsPage() {
  return (
    <>
      <Helmet>
        <title>Platform Ratings | Admin</title>
      </Helmet>

      <LayoutWrapper activePage="Ratings">
        <LazyLoadingWrapper>
          <MemoizedAdminRatings />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}