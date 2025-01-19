import React from 'react';
import {
    Button,
    useDataProvider,
    useNotify,
    useRefresh,
    useUnselectAll,
    useListContext
} from 'react-admin';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const BulkCopyButton = () => {
    const { selectedIds } = useListContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll();

    const handleBulkCopy = async () => {
        if (!selectedIds?.length) {
            notify('No items selected', { type: 'warning' });
            return;
        }

        try {
            console.log('Starting copy operation for IDs:', selectedIds);

            // Try to fetch records individually since getMany returned empty
            const records = await Promise.all(
                selectedIds.map(async (id) => {
                    console.log('Fetching record:', id);
                    const response = await dataProvider.getOne('products', { id });
                    console.log('Fetched record:', response);
                    return response.data;
                })
            );

            console.log('Fetched all records:', records);

            if (!records.length) {
                notify('No records found to copy', { type: 'warning' });
                return;
            }

            // Create copies
            for (const record of records) {
                if (!record) continue;

                const { id, _id, ...dataWithoutId } = record; // Remove both possible id fields

                console.log('Creating copy of record:', dataWithoutId);

                await dataProvider.create('products', {
                    data: {
                        ...dataWithoutId,
                        name: `${dataWithoutId.name} (Copy)`
                    }
                });
            }

            refresh();
            unselectAll('products');
            notify(`Copied ${records.length} record(s) successfully`, { type: 'success' });

        } catch (error) {
            console.error('Copy operation failed:', error);
            notify(`Error: ${error.message}`, { type: 'error' });
        }
    };

    return (
        <Button
            label="Copy selected"
            onClick={handleBulkCopy}
        >
            <ContentCopyIcon />
        </Button>
    );
};

export default BulkCopyButton;