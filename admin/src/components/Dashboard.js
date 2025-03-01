import { Card, CardContent, CardHeader } from '@mui/material';
import { Title } from 'react-admin';

export const Dashboard = () => (
    <Card>
        <Title title="Welcome to the Admin Panel" />
        <CardHeader title="Dashboard" />
        <CardContent>
            <p>Welcome to your admin panel. Here you can manage products and users.</p>
        </CardContent>
    </Card>
);