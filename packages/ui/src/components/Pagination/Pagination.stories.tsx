import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = { title: 'Navigation/Pagination', component: Pagination };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} totalPages={20} onPageChange={setPage} />;
  },
};
