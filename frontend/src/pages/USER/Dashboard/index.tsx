import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LayoutWrapper from '../../../common/Layout';
import LazyLoadingWrapper from '../../../common/LazyLoading';

// 1. Load the component lazily
const RenderDashboard = lazy(() => import('../../../components/USER/Dashboard'));

// 2. Create a memoized version that won't re-render when parent state changes
const MemoizedDashboard = memo(RenderDashboard);

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <LayoutWrapper activePage="Dashboard">
        <LazyLoadingWrapper>
          <MemoizedDashboard />
        </LazyLoadingWrapper>
      </LayoutWrapper>
    </>
  );
}
