import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    DateField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    BooleanInput,
} from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="telegramId" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="username" />
            <BooleanField source="isOnboarded" />
            <BooleanField source="checkCare" />
            <BooleanField source="checkDecorate" />
            <BooleanField source="checkAccessories" />
            <BooleanField source="checkWeight" />
            <DateField source="createdAt" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="telegramId" disabled />
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="username" />
            <BooleanInput source="isOnboarded" />
            <BooleanInput source="checkCare" />
            <BooleanInput source="checkDecorate" />
            <BooleanInput source="checkAccessories" />
            <BooleanInput source="checkWeight" />
        </SimpleForm>
    </Edit>
);