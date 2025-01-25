import {
    Datagrid,
    DateField,
    List,
    NumberField,
    Edit,
    Create,
    SimpleForm,
    NumberInput,
} from 'react-admin';

export const LevelList = (props) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <NumberField source="level" />
            <NumberField source="referrals" />
            <NumberField source="rewards.permanent" label="permanent" />
            <NumberField source="rewards.oneTime" label="oneTime" />
            <NumberField source="rewards.cashback" label="cashback" />         
            <DateField source="createdAt" />
        </Datagrid>
    </List>
);

export const LevelEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="level" />
            <NumberInput source="referrals" />
            <NumberInput source="rewards.permanent" label="permanent" />
            <NumberInput source="rewards.oneTime" label="oneTime" />
            <NumberInput source="rewards.cashback" label="cashback" />
            <DateField source="createdAt" />
        </SimpleForm>
    </Edit>
);

export const LevelCreate = () => (
    <Create>
        <SimpleForm>
            <NumberInput source="level" />
            <NumberInput source="referrals" />
            <NumberInput source="rewards.permanent" label="permanent" />
            <NumberInput source="rewards.oneTime" label="oneTime" />
            <NumberInput source="rewards.cashback" label="cashback" />
            <DateField source="createdAt" />
        </SimpleForm>
    </Create>
);
