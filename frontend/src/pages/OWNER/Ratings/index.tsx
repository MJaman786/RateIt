import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

const RenderOwnerRatings = lazy(() => import('../../../components/OWNER/Rating'));
const MemoizedOwnerRatings = memo(RenderOwnerRatings);

export default function OwnerRatingsPage() {
  return (
    <>
      <Helmet>
        <title>Store Feedback | Owner</title>
      </Helmet>

      <LayoutWrapper activePage="Store Ratings">
        <LazyLoadingWrapper>
          <MemoizedOwnerRatings />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}