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
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    SelectInput,
    NumberInput,
    TitlePortal,
    ImageField,
} from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="telegramId" />
            <TextField source="firstName" />
            <TextField source="lastName" />
            <TextField source="username" />
            <BooleanField source="isOnboarded" />
            <BooleanField source="checkCare" />
            <BooleanField source="checkDecorate" />
            <BooleanField source="checkAccessories" />
            <BooleanField source="checkWeight" />
            <DateField source="createdAt" showTime={true} />
            <ImageField source="photo.url" label="Photo" />
            <EditButton />
        </Datagrid>
    </List>
);

const UserTitle = ({ record }) => {
    return <span>User {record ? `"${record.firstName} ${record.lastName}"` : ''}</span>;
};

export const UserEdit = () => (
    <Edit title={<UserTitle />}>
        <SimpleForm>
            {/* Basic Information Section */}
            <TitlePortal>Basic Information</TitlePortal>
            <TextInput source="telegramId" disabled />
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <TextInput source="username" />

            {/* Checkboxes Section */}
            <TitlePortal>Status</TitlePortal>
            <BooleanInput source="isOnboarded" />
            <BooleanInput source="checkCare" />
            <BooleanInput source="checkDecorate" />
            <BooleanInput source="checkAccessories" />
            <BooleanInput source="checkWeight" />

            {/* Referrals Section */}
            <TitlePortal>Referrals</TitlePortal>
            <ArrayInput source="referrals">
                <SimpleFormIterator inline>
                    <ReferenceInput
                        source="userId"
                        reference="users"
                        label="Select User"
                    >
                        <SelectInput
                            optionText={(record) =>
                                record ? `${record.firstName} ${record.lastName} (${record.username})` : ''
                            }
                        />
                    </ReferenceInput>
                </SimpleFormIterator>
            </ArrayInput>

            {/* Rewards Section */}
            <TitlePortal>Rewards</TitlePortal>
            <TextInput source="reward.type" label="Reward Type" />
            <NumberInput source="reward.value" label="Reward Value" />
            <BooleanInput source="reward.claimed" label="Reward Claimed" />
        </SimpleForm>
    </Edit>
);