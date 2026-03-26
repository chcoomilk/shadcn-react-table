import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Tabs } from '@mantine/core';
import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';
import ModalExample from '../examples/editing-crud-modal';
import InlineRowExample from '../examples/editing-crud-row';
import InlineCellExample from '../examples/editing-crud-cell';
import InlineTableExample from '../examples/editing-crud-table';
import TreeEditingExample from '../examples/editing-crud-tree';

const EditingCRUDExamples = ({ isPage = false }) => {
  const { pathname, push } = useRouter();
  const [activeTab, setActiveTab] = useState(
    isPage ? pathname.split('/').pop() : 'editing-crud',
  );

  return (
    <>
      <Box style={{ borderBottom: '1px solid', borderColor: 'gray.3' }}>
        <Tabs
          value={isPage ? pathname.split('/').pop() : activeTab}
          onChange={(newPath) =>
            isPage && newPath !== 'more'
              ? push(newPath as string)
              : setActiveTab(newPath as string)
          }
        >
          <Tabs.List>
            <Tabs.Tab value="editing-crud">Modal</Tabs.Tab>
            <Tabs.Tab value="editing-crud-inline-row">Inline Row</Tabs.Tab>
            <Tabs.Tab value="editing-crud-inline-cell">Inline Cell</Tabs.Tab>
            <Tabs.Tab value="editing-crud-inline-table">Inline Table</Tabs.Tab>
            <Tabs.Tab value="editing-crud-tree">Tree Editing</Tabs.Tab>
            <Link href="/docs/examples/remote" passHref legacyBehavior>
              <Tabs.Tab value="more">
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  Non TanStack Query Fetching
                  <IconExternalLink size="1rem" />
                </Box>
              </Tabs.Tab>
            </Link>
            <Link href="/docs/examples" passHref legacyBehavior>
              <Tabs.Tab value="more">
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  More Examples
                  <IconExternalLink size="1rem" />
                </Box>
              </Tabs.Tab>
            </Link>
          </Tabs.List>
        </Tabs>
      </Box>
      <Box>
        {activeTab === 'editing-crud' && <ModalExample />}
        {activeTab === 'editing-crud-inline-row' && <InlineRowExample />}
        {activeTab === 'editing-crud-inline-cell' && <InlineCellExample />}
        {activeTab === 'editing-crud-inline-table' && <InlineTableExample />}
        {activeTab === 'editing-crud-tree' && <TreeEditingExample />}
      </Box>
    </>
  );
};

export default EditingCRUDExamples;
