// ProductBulkActionButtons.js
import React from 'react';
import {
    BulkDeleteButton,
    BulkExportButton
} from 'react-admin';

import BulkCopyButton from './BulkCopyButton';

const ProductBulkActionButtons = (props) => (
    <>
        {/* The default Bulk Export button */}
        <BulkExportButton {...props} />
        {/* The default Bulk Delete button */}
        <BulkDeleteButton {...props} />
        {/* Our custom Bulk Copy button */}
        <BulkCopyButton {...props} />
    </>
);

export default ProductBulkActionButtons;
