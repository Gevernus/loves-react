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
    ImageField,
    ImageInput,
} from 'react-admin';

export const ProductList = () => (
    <List>
        <Datagrid>
            <TextField source="name" />
            <NumberField source="price" />
            <TextField source="category" />
            <ImageField source="image" />
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
            <TextInput source="description" multiline rows={4} />
            <ImageInput source="image" label="Product Image" accept="image/*">
                <ImageField source="src" />
            </ImageInput>
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
            <TextInput source="description" multiline rows={4} />
            <ImageInput source="image" label="Product Image" accept="image/*">
                <ImageField source="src" />
            </ImageInput>
            <ArrayInput source="colors">
                <SimpleFormIterator>
                    <TextInput />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Create>
);