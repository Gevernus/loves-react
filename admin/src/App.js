import { Admin, Resource, ListGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import { ProductList, ProductEdit, ProductCreate } from './components/Products';
import { UserList, UserEdit } from './components/Users';
import { Dashboard } from './components/Dashboard';

const App = () => (
  <Admin
    dashboard={Dashboard}
    dataProvider={dataProvider}
  >
    <Resource
      name="products"
      list={ProductList}
      edit={ProductEdit}
      create={ProductCreate}
    />
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
    />
  </Admin>
);

export default App;