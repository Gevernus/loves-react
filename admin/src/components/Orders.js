import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    SimpleForm,
    TextInput,
    SelectInput,
    ReferenceField,
    ReferenceInput,
    NumberInput
} from 'react-admin';

const ProductsField = ({ record }) => {
    // Add more detailed logging
    console.log('Full record:', record);
    console.log('Items array:', record?.items);

    // Make sure record exists and has items property
    if (!record) {
        console.log('Record is undefined');
        return null;
    }

    if (!record.items) {
        console.log('Items array is undefined');
        return null;
    }

    return (
        <ul>
            {record.items.map((item, index) => (
                <li key={index}>
                    Product ID: {item.productId},
                    Quantity: {item.quantity},
                    Price: {item.price}
                </li>
            ))}
        </ul>
    );
};

export const OrderList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" label="Order ID" />
            <TextField source="userId" label="User ID" />
            <TextField source="status" />
            <TextField source="total" label="Total Amount" />
            <TextField source="paymentToken" label="Payment Token" />
            <TextField source="paymentUrl" label="Payment URL" />
            <TextField source="paymentId" label="Payment ID" />
            <FunctionField
                label="Product IDs"
                render={(record) =>
                    record.items
                        ?.map((item) => item.productId)
                        .join(', ') || 'No Products'
                }
            />
            <DateField source="createdAt" label="Created At" />
            <DateField source="updatedAt" label="Updated At" />
        </Datagrid>
    </List>
);

// Order Edit
export const OrderEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled label="Order ID" />
            <ReferenceInput source="userId" reference="users" label="User">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <SelectInput
                source="status"
                choices={[
                    { id: 'pending', name: 'Pending' },
                    { id: 'paid', name: 'Paid' },
                    { id: 'failed', name: 'Failed' },
                    { id: 'cancelled', name: 'Cancelled' }
                ]}
            />
            <NumberInput source="total" label="Total Amount" />
        </SimpleForm>
    </Edit>
);
