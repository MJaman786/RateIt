import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderUserRatings = lazy(() => import('../../../components/USER/Ratings'));
const MemoizedUserRatings = memo(RenderUserRatings);

export default function UserRatingsPage() {
  return (
    <>
      <Helmet>
        <title>My Submissions | User</title>
      </Helmet>

      <LayoutWrapper activePage="My Ratings">
        <LazyLoadingWrapper>
          <MemoizedUserRatings />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}