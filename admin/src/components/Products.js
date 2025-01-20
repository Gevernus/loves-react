import {
    List,
    Datagrid,
    TextField,
    NumberField,
    EditButton,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    ArrayInput,
    SimpleFormIterator,
} from 'react-admin';
import ProductBulkActionButtons from './ProductBulkActionButtons';

export const ProductList = () => (
    <List>
        <Datagrid
            rowClick="edit"
            bulkActionButtons={<ProductBulkActionButtons />}
        >
            <TextField source="name" />
            <NumberField source="price" />
            <TextField source="category" />
            <TextField source="short_description" />
            <TextField source="image" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <NumberInput source="price" />
            <TextInput source="category" />
            <TextInput source="short_description" />
            <TextInput source="description" multiline rows={4} />
            <TextInput source="contains" multiline rows={3} />
            <TextInput source="using" multiline rows={3} />
            <TextInput source="image" />
            <ArrayInput source="colors">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);

export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <NumberInput source="price" />
            <TextInput source="category" />
            <TextInput source="short_description" />
            <TextInput source="description" multiline rows={4} />
            <TextInput source="contains" multiline rows={3} />
            <TextInput source="using" multiline rows={3} />
            <TextInput source="image" />
            <ArrayInput source="colors">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Create>
);