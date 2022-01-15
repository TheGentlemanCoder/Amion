import MapSection from './components/map/Map';

import './App.css';

const location = {
    address: '1923 N Hamilton St, Spokane, WA 99207',
    lat: 47.6754785,
    lng: -117.3968262 
}

function App() {
  return (
    <div className="App">
      <h1>Hello world!</h1>
      <MapSection location={location} zoomLevel={17}/>
    </div>
  );
}

export default App;
