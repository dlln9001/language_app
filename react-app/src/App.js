import './index.css'
import LandingPage from './components/landing-page/LandingPage';

import { AudioValuesProvider } from './contexts/AudioValuesContext';

function App() {
  return (
    <AudioValuesProvider>
      <LandingPage />
    </AudioValuesProvider>
  );
}

export default App;
