import { Admin, Resource, EditGuesser  } from 'react-admin';
import { dataProvider } from './dataProvider';
import { ProductList, ProductEdit, ProductCreate } from './components/Products';
import { UserList, UserEdit } from './components/Users';
import { OrderList, OrderEdit } from './components/Orders';
import { LevelList, LevelEdit, LevelCreate} from './components/Levels';
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
    <Resource
      name="orders" // Add orders resource
      list={OrderList}
      edit={OrderEdit}
    />
    <Resource
      name="levels" // Add levels resource
      list={LevelList}
      edit={LevelEdit}
      create={LevelCreate}
    />
    
  </Admin>
);

export default App;